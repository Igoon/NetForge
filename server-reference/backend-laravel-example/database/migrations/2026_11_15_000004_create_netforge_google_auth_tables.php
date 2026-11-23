<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('netforge_google_identities', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $t->string('google_sub',255)->unique();
            $t->timestamps();
        });
        Schema::create('netforge_refresh_sessions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $t->char('token_hash',64)->unique();
            $t->timestamp('expires_at')->index();
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('netforge_refresh_sessions');
        Schema::dropIfExists('netforge_google_identities');
    }
};
