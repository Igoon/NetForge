<?php
// Example only: merge into routes/api.php. Make sure /api/v1 prefix isn't duplicated.
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NetForgeRatingController;
use App\Http\Controllers\Api\NetForgeFeedbackController;
use App\Http\Controllers\Api\NetForgePlayerSyncController;
use App\Http\Controllers\Api\NetForgeGoogleAuthController;
Route::prefix('v1')->group(function () {
 Route::get('/auth/config', [NetForgeGoogleAuthController::class, 'config'])->middleware('throttle:60,1');
 Route::post('/auth/google', [NetForgeGoogleAuthController::class, 'google'])->middleware('throttle:8,1');
 Route::post('/auth/refresh', [NetForgeGoogleAuthController::class, 'refresh'])->middleware('throttle:20,1');
 Route::post('/auth/logout', [NetForgeGoogleAuthController::class, 'logout'])->middleware('throttle:20,1');
 Route::get('/me', [NetForgeGoogleAuthController::class, 'me'])->middleware(['auth:sanctum','throttle:60,1']);
 Route::get('/ratings/summary',[NetForgeRatingController::class,'summary'])->middleware('throttle:60,1');
 Route::middleware(['auth:sanctum','throttle:6,1'])->group(function () {
  Route::get('/ratings/me',[NetForgeRatingController::class,'me']);
  Route::get('/player-sync',[NetForgePlayerSyncController::class,'show']);
  Route::put('/player-sync',[NetForgePlayerSyncController::class,'upsert']);
  Route::put('/ratings/me',[NetForgeRatingController::class,'upsert']);
  Route::post('/feedback/reports',[NetForgeFeedbackController::class,'submit']);
  Route::get('/feedback/reports/me',[NetForgeFeedbackController::class,'mine']);
 });
 Route::middleware(['auth:sanctum','can:moderate-netforge-feedback','throttle:30,1'])->group(function () {
  Route::get('/admin/feedback/reports',[NetForgeFeedbackController::class,'adminReports']);
  Route::get('/admin/feedback/summary',[NetForgeFeedbackController::class,'adminSummary']);
  Route::patch('/admin/feedback/reports/{id}',[NetForgeFeedbackController::class,'updateReport']);
  Route::get('/admin/feedback/ratings',[NetForgeFeedbackController::class,'adminRatings']);
  Route::patch('/admin/feedback/ratings/{id}',[NetForgeFeedbackController::class,'moderateRating']);
 });
});
