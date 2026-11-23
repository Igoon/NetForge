<?php
// router for PHP built-in server, root = public/
$path=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
if($path==='/api/v1/health'){header('Content-Type: application/json');echo json_encode(['status'=>'ok','api'=>'netforge-v1']);exit;}
if(!str_starts_with($path,'/api/v1/')) { http_response_code(404); exit; }
require dirname(__DIR__).'/src/common.php';
header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');header('Referrer-Policy: no-referrer');
$origin=$_SERVER['HTTP_ORIGIN']??'';$allowed=conf('NETFORGE_ORIGIN','');
if($origin!=='' && $origin!==$allowed){response(403,['error'=>'Origin tidak diizinkan']);}
if($origin!=='' && $origin===$allowed){header('Access-Control-Allow-Origin: '.$allowed);header('Vary: Origin');header('Access-Control-Allow-Headers: Authorization, Content-Type');header('Access-Control-Allow-Methods: GET, POST, OPTIONS');}
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){http_response_code(204);exit;}
if(conf('NETFORGE_ALLOW_HTTP','0')!=='1' && empty($_SERVER['HTTPS']) && ($_SERVER['HTTP_X_FORWARDED_PROTO']??'')!=='https')response(403,['error'=>'HTTPS diperlukan']);
$method=$_SERVER['REQUEST_METHOD'];
if($path==='/api/v1/auth/config'&&$method==='GET')response(200,['enabled'=>conf('NETFORGE_GOOGLE_CLIENT_ID')!=='','googleClientId'=>conf('NETFORGE_GOOGLE_CLIENT_ID'),'provider'=>'google']);
$pdo=db();
if($path==='/api/v1/auth/google'&&$method==='POST'){
 auth_rate($pdo,'google',12);$body=input();$claims=google_identity((string)($body['credential']??''));
 $sub=(string)$claims['sub'];$email=(string)($claims['email']??'');$name=trim((string)($claims['name']??''));$name=mb_safe_name($name,$email);$picture=google_picture((string)($claims['picture']??''));
 $pdo->beginTransaction();
 try {
  $q=$pdo->prepare('SELECT user_id FROM google_accounts WHERE google_sub=?');$q->execute([$sub]);$uid=$q->fetchColumn();
  if($uid===false){
    // Legacy users requires a token_hash: a random unissued value prevents an accidental shared token.
    $q=$pdo->prepare('INSERT INTO users(name,token_hash) VALUES(?,?)');$q->execute([$name,hash('sha256',random_bytes(32))]);$uid=(int)$pdo->lastInsertId();
    $q=$pdo->prepare('INSERT INTO google_accounts(google_sub,user_id,email,picture_url) VALUES(?,?,?,?)');$q->execute([$sub,$uid,$email,$picture]);
  } else {$uid=(int)$uid;$q=$pdo->prepare('UPDATE google_accounts SET email=?,picture_url=? WHERE google_sub=?');$q->execute([$email,$picture,$sub]);$q=$pdo->prepare('UPDATE users SET name=? WHERE id=?');$q->execute([$name,$uid]);}
  $pdo->commit();
 }catch(Throwable $e){$pdo->rollBack();throw $e;}
 $tokens=new_player_session($pdo,(int)$uid);response(200,['player'=>player_public($pdo,(int)$uid)]+$tokens);
}
if($path==='/api/v1/auth/refresh'&&$method==='POST'){
 auth_rate($pdo,'refresh',45);$body=input();$tokens=refresh_player_session($pdo,(string)($body['refreshToken']??''));response(200,$tokens);
}
if($path==='/api/v1/auth/logout'&&$method==='POST'){
 $body=input();$refresh=(string)($body['refreshToken']??'');
 if(preg_match('/^nfr_[a-f0-9]{64}$/D',$refresh)){$q=$pdo->prepare('UPDATE player_sessions SET revoked=1 WHERE refresh_hash=?');$q->execute([hash('sha256',$refresh)]);}
 response(200,['ok'=>true]);
}
$user=auth($pdo);
if($path==='/api/v1/me'&&$method==='GET')response(200,player_public($pdo,(int)$user['id']));
if($path==='/api/v1/profile/leaderboard'&&$method==='POST'){
 $body=input();if(!array_key_exists('optIn',$body)||!is_bool($body['optIn']))response(422,['error'=>'optIn wajib berupa boolean']);
 $q=$pdo->prepare('UPDATE users SET leaderboard_opt_in=? WHERE id=?');$q->execute([$body['optIn']?1:0,$user['id']]);response(200,player_public($pdo,(int)$user['id']));
}
if($path==='/api/v1/leaderboard'&&$method==='GET'){
 // The only supported official mission is Network Fundamentals v1. One passed lab => one 100 XP award.
 $q=$pdo->query('SELECT u.id,u.name,g.picture_url,MAX(a.score) best_score,COUNT(a.id) total_attempts,MAX(CASE WHEN a.passed=1 THEN 1 ELSE 0 END) passed_unique FROM users u JOIN attempts a ON a.user_id=u.id LEFT JOIN google_accounts g ON g.user_id=u.id WHERE u.leaderboard_opt_in=1 GROUP BY u.id ORDER BY passed_unique DESC,best_score DESC,total_attempts ASC,u.id ASC LIMIT 50');
 $players=[];foreach($q->fetchAll(PDO::FETCH_ASSOC) as $index=>$p){$players[]=['rank'=>$index+1,'name'=>$p['name'],'picture'=>$p['picture_url']?:null,'officialXP'=>((int)$p['passed_unique'])*100,'completedLabs'=>(int)$p['passed_unique'],'bestScore'=>(int)$p['best_score']];}
 response(200,['scope'=>'opt-in','scoring'=>'unique-guided-lab-v1','players'=>$players]);
}

if($path==='/api/v1/progress'&&$method==='GET'){
 $stmt=$pdo->prepare('SELECT attempt_id,score,passed,created_at FROM attempts WHERE user_id=? ORDER BY id DESC LIMIT 50');$stmt->execute([$user['id']]);$attempts=$stmt->fetchAll(PDO::FETCH_ASSOC);
 $stmt=$pdo->prepare('SELECT COUNT(*) FROM attempts WHERE user_id=? AND passed=1');$stmt->execute([$user['id']]);$completed=(int)$stmt->fetchColumn();
 $stats=$pdo->prepare('SELECT COUNT(*) AS total, COALESCE(MAX(score),0) AS best_score, COALESCE(ROUND(AVG(score),1),0) AS average_score, SUM(CASE WHEN passed=1 THEN 1 ELSE 0 END) AS passed_total FROM attempts WHERE user_id=?');
 $stats->execute([$user['id']]);$summary=$stats->fetch(PDO::FETCH_ASSOC);
 response(200,['player'=>$user['name'],'completedAttempts'=>$completed,'officialXP'=>($completed>0?100:0),
   'completedLabs'=>($completed>0?1:0),'xpRule'=>'unique-guided-lab-v1',
   'totalAttempts'=>(int)$summary['total'],'bestScore'=>(int)$summary['best_score'],
   'averageScore'=>(float)$summary['average_score'],'passedAttempts'=>(int)$summary['passed_total'],
   'attempts'=>$attempts]);
}
if($path==='/api/v1/unified-missions'&&$method==='GET'){
 $q=$pdo->prepare('SELECT mission,COUNT(*) attempts,MAX(score) best_score,MAX(passed) completed,MIN(CASE WHEN passed=1 THEN created_at END) first_completed FROM unified_mission_attempts WHERE user_id=? GROUP BY mission');
 $q->execute([$user['id']]);$rows=[];foreach($q->fetchAll(PDO::FETCH_ASSOC) as $v)$rows[$v['mission']]=['attempts'=>(int)$v['attempts'],'bestScore'=>(int)$v['best_score'],'completed'=>(bool)$v['completed'],'firstCompleted'=>$v['first_completed']];
 response(200,['missions'=>$rows,'officialXP'=>0,'scope'=>'server-validated-educational','note'=>'Tidak berkontribusi pada leaderboard atau XP resmi']);
}
if($path==='/api/v1/unified-missions'&&$method==='POST'){
 $body=input();$id=$body['attemptId']??null;$profile=$body['profile']??null;
 if(!is_string($id)||!preg_match('/^[A-Za-z0-9_-]{12,80}$/D',$id)||!is_string($profile)||!in_array($profile,['basics','smart','office'],true))response(422,['error'=>'ID percobaan/profil tidak valid']);
 $digest=hash('sha256',json_encode($body['topology']??[]));
 $q=$pdo->prepare('SELECT mission,score,passed,checks_json,evidence_digest FROM unified_mission_attempts WHERE user_id=? AND attempt_id=?');$q->execute([$user['id'],$id]);$old=$q->fetch(PDO::FETCH_ASSOC);
 if($old){if($old['mission']!==$profile || !hash_equals($old['evidence_digest'],$digest))response(409,['error'=>'attemptId sudah digunakan untuk profil atau topologi berbeda']);response(200,['attemptId'=>$id,'profile'=>$profile,'score'=>(int)$old['score'],'passed'=>(bool)$old['passed'],'checks'=>json_decode($old['checks_json'],true),'replayed'=>true,'officialXP'=>0]);}
 try{$result=evaluate_unified_mission($profile,$body['topology']??[]);}catch(InvalidArgumentException $e){response(422,['error'=>$e->getMessage()]);}
 $q=$pdo->prepare("SELECT COUNT(*) FROM unified_mission_attempts WHERE user_id=? AND created_at > datetime('now','-1 minute')");$q->execute([$user['id']]);if((int)$q->fetchColumn()>=6)response(429,['error'=>'Maksimal 6 evaluasi server per menit']);
 try{$q=$pdo->prepare('INSERT INTO unified_mission_attempts(user_id,mission,attempt_id,score,passed,checks_json,evidence_digest) VALUES(?,?,?,?,?,?,?)');$q->execute([$user['id'],$profile,$id,$result['score'],$result['passed']?1:0,json_encode($result['checks']),$digest]);}catch(PDOException $e){
  // A concurrent request may win the unique constraint: return its result idempotently.
  $again=$pdo->prepare('SELECT mission,score,passed,checks_json,evidence_digest FROM unified_mission_attempts WHERE user_id=? AND attempt_id=?');
  $again->execute([$user['id'],$id]);$existing=$again->fetch(PDO::FETCH_ASSOC);
  if($existing&&$existing['mission']===$profile&&hash_equals($existing['evidence_digest'],$digest))response(200,['attemptId'=>$id,'profile'=>$profile,'score'=>(int)$existing['score'],'passed'=>(bool)$existing['passed'],'checks'=>json_decode($existing['checks_json'],true),'replayed'=>true,'officialXP'=>0]);
  if($existing)response(409,['error'=>'ID percobaan sudah digunakan untuk profil lain']);
  throw $e;
 }
 response(201,['attemptId'=>$id,'replayed'=>false]+$result);
}
if($path==='/api/v1/attempts'&&$method==='POST'){
 $data=input();$attemptId=$data['attemptId']??null;
 if(!is_string($attemptId)||!preg_match('/^[a-zA-Z0-9_-]{12,80}$/D',$attemptId))response(422,['error'=>'attemptId tidak valid']);
 try {$result=evaluate($data['topology']??[]);}catch(InvalidArgumentException $e){response(422,['error'=>$e->getMessage()]);}
 $stmt=$pdo->prepare('SELECT id,score,passed,feedback FROM attempts WHERE user_id=? AND attempt_id=?');$stmt->execute([$user['id'],$attemptId]);
 $old=$stmt->fetch(PDO::FETCH_ASSOC);if($old)response(200,['attemptId'=>$attemptId,'score'=>(int)$old['score'],'passed'=>(bool)$old['passed'],'checks'=>json_decode($old['feedback'],true),'replayed'=>true]);
 $limit=$pdo->prepare("SELECT COUNT(*) FROM attempts WHERE user_id=? AND created_at > datetime('now','-1 minute')");$limit->execute([$user['id']]);if((int)$limit->fetchColumn()>=6)response(429,['error'=>'Terlalu banyak penilaian; coba lagi nanti']);
 $stmt=$pdo->prepare('INSERT INTO attempts(user_id,attempt_id,score,passed,feedback,evidence_digest) VALUES(?,?,?,?,?,?)');
 $stmt->execute([$user['id'],$attemptId,$result['score'],$result['passed']?1:0,json_encode($result['checks']),hash('sha256',json_encode($data['topology']))]);
 response(201,['attemptId'=>$attemptId]+$result);
}
response(404,['error'=>'Endpoint tidak ditemukan']);
