<?php
require dirname(__DIR__).'/backend/src/common.php';
$nodes=[
 ['id'=>1,'type'=>'router','config'=>['ip'=>'192.168.10.1','prefix'=>'24']],
 ['id'=>2,'type'=>'switch','config'=>[]],
 ['id'=>3,'type'=>'pc','config'=>['ip'=>'192.168.10.10','prefix'=>'24','gateway'=>'192.168.10.1']],
 ['id'=>4,'type'=>'pc','config'=>['ip'=>'192.168.10.11','prefix'=>'24','gateway'=>'192.168.10.1']],
];
$links=[['a'=>1,'b'=>2,'broken'=>false],['a'=>2,'b'=>3,'broken'=>false],['a'=>2,'b'=>4,'broken'=>false]];
$t=['format'=>'NETFORGE-LAB','version'=>1,'nodes'=>$nodes,'links'=>$links];
$r=evaluate($t);assert($r['passed']&&$r['score']===100);
$t['links'][2]['broken']=true;$r=evaluate($t);assert(!$r['passed']&&$r['score']<100);
$t['links'][2]['broken']=false;$t['nodes'][3]['config']['gateway']='192.168.1.1';$r=evaluate($t);assert(!$r['passed']);
echo "Server evaluator tests passed\n";
