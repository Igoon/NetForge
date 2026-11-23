<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
class NetForgeRatingController extends Controller {
 public function summary(){
   $stats=DB::table('netforge_ratings')->where('is_visible',true)->selectRaw('COUNT(*) as total, AVG(rating) as average')->first();
   $dist=DB::table('netforge_ratings')->where('is_visible',true)->select('rating')->selectRaw('COUNT(*) as total')->groupBy('rating')->pluck('total','rating');
   return response()->json(['average'=>round((float)($stats->average??0),2),'count'=>(int)($stats->total??0),'distribution'=>collect(range(1,5))->mapWithKeys(fn($n)=>[(string)$n=>(int)($dist[$n]??0)])->all()]);
 }
 public function me(Request $request){$row=DB::table('netforge_ratings')->where('user_id',$request->user()->id)->first();return response()->json($row);}
 public function upsert(Request $request){
   $data=$request->validate(['rating'=>['required','integer','between:1,5'],'category'=>['required','in:overall,learning,interface,missions,performance'],'comment'=>['nullable','string','max:600']]);
   $now=now();$userId=$request->user()->id;
   $values=['rating'=>$data['rating'],'category'=>$data['category'],'comment'=>$data['comment']??null,'updated_at'=>$now];
   $exists=DB::table('netforge_ratings')->where('user_id',$userId)->exists();
   if($exists){DB::table('netforge_ratings')->where('user_id',$userId)->update($values);}
   else{try{DB::table('netforge_ratings')->insert(['user_id'=>$userId,'created_at'=>$now]+$values);}catch(\Illuminate\Database\UniqueConstraintViolationException $e){DB::table('netforge_ratings')->where('user_id',$userId)->update($values);}}
   return response()->json(['saved'=>true]);
 }
}
