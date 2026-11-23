<?php
declare(strict_types=1);
function conf(string $name, string $fallback=''): string { $v=getenv($name); return $v===false?$fallback:$v; }
function db(): PDO {
    $dir=conf('NETFORGE_DB_DIR', dirname(__DIR__).'/private');
    if(!is_dir($dir)) mkdir($dir,0700,true);
    if(!in_array('sqlite',PDO::getAvailableDrivers(),true)) throw new RuntimeException('Install php-sqlite3 to enable official progress API');
    $pdo=new PDO('sqlite:'.$dir.'/netforge.sqlite',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    $pdo->exec('PRAGMA busy_timeout=4000');
    $pdo->exec('PRAGMA foreign_keys=ON');
    $pdo->exec('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT NOT NULL, token_hash TEXT UNIQUE NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, attempt_id TEXT NOT NULL, score INTEGER NOT NULL, passed INTEGER NOT NULL, feedback TEXT NOT NULL, evidence_digest TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id,attempt_id))');
    $pdo->exec('CREATE TABLE IF NOT EXISTS google_accounts(google_sub TEXT PRIMARY KEY, user_id INTEGER NOT NULL UNIQUE, email TEXT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))');
    $pdo->exec('CREATE TABLE IF NOT EXISTS player_sessions(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, access_hash TEXT UNIQUE NOT NULL, refresh_hash TEXT UNIQUE NOT NULL, access_expires INTEGER NOT NULL, refresh_expires INTEGER NOT NULL, revoked INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id))');
    $fields=$pdo->query('PRAGMA table_info(google_accounts)')->fetchAll(PDO::FETCH_ASSOC);
    if(!in_array('picture_url',array_column($fields,'name'),true)) $pdo->exec("ALTER TABLE google_accounts ADD COLUMN picture_url TEXT NOT NULL DEFAULT ''");
    $fields=$pdo->query('PRAGMA table_info(users)')->fetchAll(PDO::FETCH_ASSOC);
    if(!in_array('leaderboard_opt_in',array_column($fields,'name'),true)) $pdo->exec('ALTER TABLE users ADD COLUMN leaderboard_opt_in INTEGER NOT NULL DEFAULT 0');
    $pdo->exec('CREATE TABLE IF NOT EXISTS auth_limits(key TEXT NOT NULL, bucket INTEGER NOT NULL, count INTEGER NOT NULL, PRIMARY KEY(key,bucket))');
    $pdo->exec('CREATE TABLE IF NOT EXISTS unified_mission_attempts(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, mission TEXT NOT NULL, attempt_id TEXT NOT NULL, score INTEGER NOT NULL, passed INTEGER NOT NULL, checks_json TEXT NOT NULL, evidence_digest TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id,attempt_id), FOREIGN KEY(user_id) REFERENCES users(id))');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_unified_mission_user ON unified_mission_attempts(user_id,mission)');
    return $pdo;
}
function response(int $code,array $data): never {http_response_code($code); header('Content-Type: application/json; charset=utf-8');echo json_encode($data,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);exit;}
function input(): array {if((int)($_SERVER['CONTENT_LENGTH']??0)>150000)response(413,['error'=>'Payload terlalu besar']);$x=json_decode(file_get_contents('php://input'),true);if(!is_array($x))response(400,['error'=>'JSON tidak valid']);return $x;}
function auth(PDO $db): array {
  $hdr=$_SERVER['HTTP_AUTHORIZATION']??'';
  if(preg_match('/^Bearer (nfa_[a-f0-9]{64})$/D',$hdr,$access)){
    $stmt=$db->prepare('SELECT u.id,u.name FROM player_sessions s JOIN users u ON u.id=s.user_id WHERE s.access_hash=? AND s.revoked=0 AND s.access_expires>?');
    $stmt->execute([hash('sha256',$access[1]),time()]);
    $u=$stmt->fetch(PDO::FETCH_ASSOC);if(!$u)response(401,['error'=>'Sesi berakhir; login kembali']);return $u;
  }
  if(!preg_match('/^Bearer (nf_[a-f0-9]{64})$/D',$hdr,$m))response(401,['error'=>'Akun resmi diperlukan']);
  $stmt=$db->prepare('SELECT id,name FROM users WHERE token_hash=?');$stmt->execute([hash('sha256',$m[1])]);
  $user=$stmt->fetch(PDO::FETCH_ASSOC);if(!$user)response(401,['error'=>'Token tidak dikenali']);return $user;
}
function isIp(string $s): bool {return filter_var($s,FILTER_VALIDATE_IP,FILTER_FLAG_IPV4)!==false;}
/** Independently verifies guided lab topology. Client-computed ping, XP and score are never trusted. */
function evaluate(array $topology): array {
  $nodes=$topology['nodes']??null;$links=$topology['links']??null;
  if(($topology['format']??'')!=='NETFORGE-LAB'||($topology['version']??0)!==1||!is_array($nodes)||!is_array($links)||count($nodes)>60||count($links)>150) throw new InvalidArgumentException('Format/topologi tidak valid');
  $by=[];$roles=['router'=>[],'switch'=>[],'pc'=>[]];
  foreach($nodes as $n){
    if(!is_array($n)||!isset($n['id'],$n['type'])||!is_int($n['id'])||$n['id']<1||isset($by[$n['id']])||!in_array($n['type'],['router','switch','pc','server'],true))throw new InvalidArgumentException('Node tidak valid');
    $by[$n['id']]=$n; if(isset($roles[$n['type']]))$roles[$n['type']][]=$n;
  }
  $adj=[];foreach($links as $l){
    if(!is_array($l)||!isset($l['a'],$l['b'])||!is_int($l['a'])||!is_int($l['b'])||!isset($by[$l['a']],$by[$l['b']])||$l['a']===$l['b'])throw new InvalidArgumentException('Link tidak valid');
    if(empty($l['broken'])&&!($by[$l['a']]['broken']??false)&&!($by[$l['b']]['broken']??false)){$adj[$l['a']][]=$l['b'];$adj[$l['b']][]=$l['a'];}
  }
  $reachable=function(int $start,int $target)use($adj):bool{$seen=[$start=>true];$queue=[$start];for($i=0;$i<count($queue);$i++){$id=$queue[$i];if($id===$target)return true;foreach($adj[$id]??[] as $next){if(!isset($seen[$next])){$seen[$next]=true;$queue[]=$next;}}}return false;};
  $router=$roles['router'][0]??null;$switch=$roles['switch'][0]??null;$pcs=$roles['pc'];
  $checks=[];
  $checks['devices']=count($roles['router'])>=1&&count($roles['switch'])>=1&&count($pcs)>=2;
  $checks['links']=$checks['devices']&&$reachable($router['id'],$switch['id'])&&array_reduce($pcs,fn($ok,$pc)=>$ok&&$reachable($pc['id'],$switch['id']),true);
  $ips=array_map(fn($n)=>(string)($n['config']['ip']??''),array_merge($roles['router'],$pcs));
  $has10=false;$has11=false;
  foreach($pcs as $pc){$has10=$has10||($pc['config']['ip']??'')==='192.168.10.10';$has11=$has11||($pc['config']['ip']??'')==='192.168.10.11';}
  $checks['addressing']=$checks['devices']&&($router['config']['ip']??'')==='192.168.10.1'&&count($ips)===count(array_unique($ips))&&$has10&&$has11&&array_reduce(array_merge([$router],$pcs),fn($ok,$n)=>$ok&&isIp((string)($n['config']['ip']??''))&&(string)($n['config']['prefix']??'')==='24',true);
  $checks['gateway']=$checks['devices']&&array_reduce($pcs,fn($ok,$n)=>$ok&&($n['config']['gateway']??'')==='192.168.10.1'&&str_starts_with((string)($n['config']['ip']??''),'192.168.10.'),true);
  $checks['reachability']=$checks['links']&&$checks['addressing']&&$checks['gateway'];
  $score=count(array_filter($checks))*20;
  return ['score'=>$score,'passed'=>$score===100,'checks'=>$checks,'criterion'=>'Guided Lab Network Fundamentals v1; server-verified logical reachability (not physical ICMP)'];
}

/** Google Identity Services ID tokens are verified remotely by Google over TLS. Never trust email/name sent by browser. */
function google_identity(string $idToken): array {
  if(strlen($idToken)>10000 || substr_count($idToken,'.')!==2)response(400,['error'=>'ID token Google tidak valid']);
  if(!function_exists('curl_init'))response(503,['error'=>'PHP cURL diperlukan untuk Google Login']);
  $ch=curl_init('https://oauth2.googleapis.com/tokeninfo?id_token='.rawurlencode($idToken));
  curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>4,CURLOPT_TIMEOUT=>8,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_PROTOCOLS=>CURLPROTO_HTTPS]);
  $result=curl_exec($ch);$code=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);
  if($result===false||$code!==200)response(401,['error'=>'Google ID token tidak dapat diverifikasi']);
  $claims=json_decode((string)$result,true);
  $client=conf('NETFORGE_GOOGLE_CLIENT_ID');
  if(!is_array($claims)||$client===''||!hash_equals($client,(string)($claims['aud']??''))||!in_array(($claims['iss']??''),['accounts.google.com','https://accounts.google.com'],true)||($claims['email_verified']??'')!=='true'&&($claims['email_verified']??false)!==true||(int)($claims['exp']??0)<=time()||!preg_match('/^[0-9]{5,40}$/D',(string)($claims['sub']??'')))response(401,['error'=>'Identitas Google tidak valid']);
  return $claims;
}
function auth_rate(PDO $db,string $action,int $limit): void {
  // Best-effort per-IP rate limiting (deploy behind a trusted proxy; do not trust user-provided forwarded IP).
  $ip=(string)($_SERVER['REMOTE_ADDR']??'unknown');$key=hash('sha256',$action.'|'.$ip);$bucket=(int)floor(time()/60);
  $db->prepare('DELETE FROM auth_limits WHERE bucket<?')->execute([$bucket-3]);
  $q=$db->prepare('INSERT INTO auth_limits(key,bucket,count) VALUES(?,?,1) ON CONFLICT(key,bucket) DO UPDATE SET count=count+1');$q->execute([$key,$bucket]);
  $q=$db->prepare('SELECT count FROM auth_limits WHERE key=? AND bucket=?');$q->execute([$key,$bucket]);
  if((int)$q->fetchColumn()>$limit)response(429,['error'=>'Terlalu banyak percobaan; coba kembali beberapa saat lagi']);
}
function new_player_session(PDO $db,int $userId): array {
  $access='nfa_'.bin2hex(random_bytes(32));$refresh='nfr_'.bin2hex(random_bytes(32));$now=time();
  $db->prepare('INSERT INTO player_sessions(user_id,access_hash,refresh_hash,access_expires,refresh_expires) VALUES(?,?,?,?,?)')->execute([$userId,hash('sha256',$access),hash('sha256',$refresh),$now+900,$now+2592000]);
  return ['accessToken'=>$access,'refreshToken'=>$refresh,'expiresIn'=>900];
}
function refresh_player_session(PDO $db,string $token): array {
  if(!preg_match('/^nfr_[a-f0-9]{64}$/D',$token))response(401,['error'=>'Sesi tidak valid']);
  $db->beginTransaction();
  try {
    $q=$db->prepare('SELECT id,user_id FROM player_sessions WHERE refresh_hash=? AND revoked=0 AND refresh_expires>?');$q->execute([hash('sha256',$token),time()]);$session=$q->fetch(PDO::FETCH_ASSOC);
    if(!$session){$db->rollBack();response(401,['error'=>'Sesi telah kedaluwarsa; masuk kembali']);}
    $access='nfa_'.bin2hex(random_bytes(32));$refresh='nfr_'.bin2hex(random_bytes(32));$now=time();
    $q=$db->prepare('UPDATE player_sessions SET access_hash=?,refresh_hash=?,access_expires=?,refresh_expires=? WHERE id=? AND refresh_hash=? AND revoked=0');
    $q->execute([hash('sha256',$access),hash('sha256',$refresh),$now+900,$now+2592000,$session['id'],hash('sha256',$token)]);
    if($q->rowCount()!==1){$db->rollBack();response(409,['error'=>'Sesi telah diperbarui di tab lain; muat ulang']);}
    $db->commit();return ['accessToken'=>$access,'refreshToken'=>$refresh,'expiresIn'=>900];
  } catch(Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;}
}

function google_picture(string $url):string {
  if(strlen($url)>512||!filter_var($url,FILTER_VALIDATE_URL))return '';
  $parts=parse_url($url);$host=strtolower((string)($parts['host']??''));
  if(($parts['scheme']??'')!=='https'||!($host==='googleusercontent.com'||str_ends_with($host,'.googleusercontent.com')))return '';
  return $url;
}
function player_public(PDO $db,int $id):array {
  $q=$db->prepare('SELECT u.id,u.name,u.leaderboard_opt_in,g.email,g.picture_url FROM users u LEFT JOIN google_accounts g ON g.user_id=u.id WHERE u.id=?');$q->execute([$id]);$p=$q->fetch(PDO::FETCH_ASSOC);
  return ['id'=>(int)$p['id'],'name'=>$p['name'],'email'=>$p['email']??null,'picture'=>$p['picture_url']?:null,'leaderboardOptIn'=>(bool)$p['leaderboard_opt_in']];
}
function mb_safe_name(string $name,string $fallback):string { $name=trim(preg_replace('/[\x00-\x1f\x7f]/u','',$name)??'');return substr($name!==''?$name:$fallback,0,120); }


/** Educational mission validator. Never trust client-computed score, passed, or XP. */
function evaluate_unified_mission(string $profile, array $topology): array {
  if(!in_array($profile,['basics','smart','office'],true))throw new InvalidArgumentException('Profil misi tidak didukung');
  if(($topology['format']??'')!=='NETFORGE-UNIFIED-1')throw new InvalidArgumentException('Format topologi tidak didukung');
  $nodes=$topology['nodes']??null;$edges=$topology['edges']??null;
  if(!is_array($nodes)||!is_array($edges)||count($nodes)>80||count($edges)>150)throw new InvalidArgumentException('Ukuran topologi tidak valid');
  $types=['router','switch','pc','server','ap','laptop','phone','tv','camera','iot','nvr'];
  $by=[];$first=[];
  foreach($nodes as $n){
    if(!is_array($n)||!isset($n['id'],$n['type'])||!(is_string($n['id'])||is_int($n['id']))||!preg_match('/^[a-zA-Z0-9_-]{1,32}$/D',(string)$n['id'])||!in_array($n['type'],$types,true)||isset($by[(string)$n['id']]))throw new InvalidArgumentException('Perangkat tidak valid');
    $id=(string)$n['id'];$by[$id]=$n;if(!isset($first[$n['type']]))$first[$n['type']]=$id;
  }
  $adj=[];$wires=[];$occupied=[];
  foreach($edges as $e){
    if(!is_array($e)||!isset($e['a'],$e['b'],$e['medium'])||!in_array($e['medium'],['ethernet','poe','wifi'],true))throw new InvalidArgumentException('Media koneksi tidak valid');
    $a=(string)$e['a'];$b=(string)$e['b'];$medium=$e['medium'];
    if($a===$b||!isset($by[$a],$by[$b]))throw new InvalidArgumentException('Endpoint tidak valid');
    $key=implode(':',array_merge(array_sort_pair($a,$b),[$medium]));if(isset($wires[$key]))throw new InvalidArgumentException('Koneksi duplikat');$wires[$key]=true;
    $aType=$by[$a]['type'];$bType=$by[$b]['type'];
    if($medium==='wifi'&&!in_array('router',[$aType,$bType],true)&&!in_array('ap',[$aType,$bType],true))throw new InvalidArgumentException('Wi-Fi harus melalui router/AP');
    if($medium==='poe'&&!((($aType==='switch')&&$bType==='camera')||(($bType==='switch')&&$aType==='camera')))throw new InvalidArgumentException('PoE harus antara switch dan kamera');
    if($medium==='wifi'&&(in_array($aType,['switch','server','pc','nvr'],true)||in_array($bType,['switch','server','pc','nvr'],true)))throw new InvalidArgumentException('Perangkat tidak kompatibel dengan Wi-Fi pada profil ini');
    if($medium!=='wifi'&&(in_array($aType,['phone','iot'],true)||in_array($bType,['phone','iot'],true)))throw new InvalidArgumentException('Perangkat hanya mendukung Wi-Fi');
    if($medium!=='wifi'){
      foreach([[$a,'portA'],[$b,'portB']] as [$id,$field]){
        $port=$e[$field]??null;if(!is_string($port)||!preg_match('/^(LAN[1-9][0-9]?|ETH[0-9])$/D',$port))throw new InvalidArgumentException('Port fisik harus disebutkan');
        // Restrict claimed port labels to device's declared physical capabilities.
        $deviceType=$by[$id]['type'];
        $portCount=match($deviceType){'router'=>4,'switch'=>8,'ap'=>1,'pc','server','laptop','tv','nvr','camera'=>1,default=>0};
        $validPort=($deviceType==='router'||$deviceType==='switch')
          ? preg_match('/^LAN([1-9][0-9]?)$/D',$port,$number)&&((int)$number[1]<=$portCount)
          : ($portCount===1&&$port==='ETH0');
        if(!$validPort)throw new InvalidArgumentException('Port tidak tersedia pada jenis perangkat ini');
        $pk=$id.':'.$port;if(isset($occupied[$pk]))throw new InvalidArgumentException('Satu port digunakan lebih dari sekali');$occupied[$pk]=true;
      }
    }
    $adj[$a][]=[$b,$medium];$adj[$b][]=[$a,$medium];
  }
  $find=static function(?string $start,?string $end,?string $medium=null)use($adj):bool{
    if($start===null||$end===null)return false;$q=[$start];$seen=[$start=>true];
    for($i=0;$i<count($q);$i++){if($q[$i]===$end)return true;foreach($adj[$q[$i]]??[] as [$n,$m]){if($medium!==null&&$m!==$medium)continue;if(!isset($seen[$n])){$seen[$n]=true;$q[]=$n;}}}return false;
  };
  $direct=static function(?string $a,?string $b,string $medium)use($adj):bool{if($a===null||$b===null)return false;foreach($adj[$a]??[] as [$n,$m])if($n===$b&&$m===$medium)return true;return false;};
  $router=$first['router']??null;$switch=$first['switch']??null;$pc=$first['pc']??null;$server=$first['server']??null;$ap=$first['ap']??$router;
  $tv=$first['tv']??null;$camera=$first['camera']??null;$iot=$first['iot']??null;$nvr=$first['nvr']??null;
  $checks=[];
  if($profile==='basics'){
    $checks=['devices'=>$router!==null&&$switch!==null&&$pc!==null,'lan'=>$direct($router,$switch,'ethernet'),'pc'=>$direct($pc,$switch,'ethernet'),'addressing'=>unified_ipv4_ok($by,[$router,$pc])];
  }elseif($profile==='office'){
    $checks=['devices'=>$router!==null&&$switch!==null&&$pc!==null&&$server!==null,'uplink'=>$direct($router,$switch,'ethernet'),'clients'=>$direct($pc,$switch,'ethernet')&&$direct($server,$switch,'ethernet'),'addressing'=>unified_ipv4_ok($by,[$router,$pc,$server])];
  }else{
    $checks=['devices'=>$ap!==null&&$switch!==null&&$tv!==null&&$camera!==null&&$iot!==null&&$nvr!==null,'backhaul'=>$find($ap,$switch),'tv'=>$find($tv,$ap),'iot'=>$direct($iot,$ap,'wifi'),'poe'=>$direct($switch,$camera,'poe'),'recording'=>$find($camera,$nvr)];
  }
  $passed=count(array_filter($checks,fn($v)=>$v===true));$score=(int)round($passed/count($checks)*100);
  return ['profile'=>$profile,'score'=>$score,'passed'=>$passed===count($checks),'checks'=>$checks,'criterion'=>'Server-validated educational topology; client evidence is not trusted for XP','officialXP'=>0];
}
function array_sort_pair(string $a,string $b):array{$p=[$a,$b];sort($p,SORT_STRING);return $p;}
function unified_ipv4_ok(array $by,array $ids):bool{
 if(in_array(null,$ids,true))return false;
 $ips=[];$subnet=null;
 foreach($ids as $id){$n=$by[$id];$mode=$n['ipMode']??'dhcp';
  if($mode!=='static')return false;
  $ip=(string)($n['ip']??'');$mask=(string)($n['mask']??'255.255.255.0');
  if(!filter_var($ip,FILTER_VALIDATE_IP,FILTER_FLAG_IPV4)||$mask!=='255.255.255.0'||isset($ips[$ip]))return false;
  $ips[$ip]=true;$network=implode('.',array_slice(explode('.',$ip),0,3));
  if($subnet===null)$subnet=$network;elseif($subnet!==$network)return false;
  if($n['type']!=='router'&&($n['gateway']??'')!==($by[$ids[0]]['ip']??''))return false;
 }
 return true;
}
