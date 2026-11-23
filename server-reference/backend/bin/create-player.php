<?php
declare(strict_types=1);
require dirname(__DIR__).'/src/common.php';
if(PHP_SAPI!=='cli'){fwrite(STDERR,"CLI only\n");exit(1);}
$name=trim($argv[1]??'');if($name===''||strlen($name)>160){fwrite(STDERR,"Usage: php bin/create-player.php \"Student Name\"\n");exit(2);}
$token='nf_'.bin2hex(random_bytes(32));$db=db();$s=$db->prepare('INSERT INTO users(name,token_hash) VALUES(?,?)');$s->execute([$name,hash('sha256',$token)]);
echo "Player ID: ".$db->lastInsertId()."\nToken (displayed once): $token\n";
