<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
class NetForgeFeedbackController extends Controller {
 public function submit(Request $request){
  $data=$request->validate(['kind'=>'required|in:gameplay,network,ui,performance,update,other','title'=>'required|string|min:8|max:120','description'=>'required|string|min:20|max:2000','severity'=>'required|in:low,medium,high','app_version'=>'nullable|string|max:40']);
  $id=DB::table('netforge_bug_reports')->insertGetId($data+['user_id'=>$request->user()->id,'status'=>'new','created_at'=>now(),'updated_at'=>now()]);return response()->json(['id'=>$id,'status'=>'new'],201);
 }
 public function mine(Request $request){return response()->json(['data'=>DB::table('netforge_bug_reports')->where('user_id',$request->user()->id)->select('id','title','kind','severity','status','created_at')->orderByDesc('id')->limit(30)->get()]);}
 public function adminReports(Request $request){
  Gate::authorize('moderate-netforge-feedback');
  $validated=$request->validate(['status'=>'sometimes|in:new,triaged,in_progress,resolved,closed','page'=>'sometimes|integer|min:1|max:10000']);
  $q=DB::table('netforge_bug_reports');
  if(!empty($validated['status']))$q->where('status',$validated['status']);
  return $q->orderByDesc('id')->paginate(25);
 }
 public function adminSummary(Request $request){
  Gate::authorize('moderate-netforge-feedback');
  $stats=DB::table('netforge_bug_reports')->selectRaw('status,COUNT(*) AS total')->groupBy('status')->pluck('total','status');
  return response()->json([
   'total'=>(int)collect($stats)->sum(),
   'new'=>(int)($stats['new']??0),
   'triaged'=>(int)($stats['triaged']??0),
   'in_progress'=>(int)($stats['in_progress']??0),
   'resolved'=>(int)($stats['resolved']??0),
   'closed'=>(int)($stats['closed']??0),
  ]);
 }
 public function updateReport(Request $request,int $id){Gate::authorize('moderate-netforge-feedback');$data=$request->validate(['status'=>'required|in:new,triaged,in_progress,resolved,closed','admin_note'=>'nullable|string|max:2000']);abort_unless(DB::table('netforge_bug_reports')->where('id',$id)->update($data+['updated_at'=>now()]),404);\Illuminate\Support\Facades\Log::info('NetForge feedback moderation', ['actor_id'=>$request->user()->id,'report_id'=>$id,'status'=>$data['status']]);return response()->json(['updated'=>true]);}
 public function adminRatings(Request $request){Gate::authorize('moderate-netforge-feedback');return DB::table('netforge_ratings')->select('id','user_id','rating','category','comment','is_visible','created_at')->orderByDesc('id')->paginate(25);}
 public function moderateRating(Request $request,int $id){Gate::authorize('moderate-netforge-feedback');$data=$request->validate(['is_visible'=>'required|boolean']);abort_unless(DB::table('netforge_ratings')->where('id',$id)->update($data+['updated_at'=>now()]),404);\Illuminate\Support\Facades\Log::info('NetForge rating visibility moderation', ['actor_id'=>$request->user()->id,'rating_id'=>$id,'is_visible'=>$data['is_visible']]);return response()->json(['updated'=>true]);}
}
