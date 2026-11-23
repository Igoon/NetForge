<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void { Schema::create('netforge_bug_reports', function(Blueprint $table){
  $table->id();$table->foreignId('user_id')->index();$table->string('kind',25);$table->string('title',120);$table->text('description');$table->string('severity',10)->default('medium');$table->string('app_version',40)->nullable();$table->string('status',20)->default('new')->index();$table->text('admin_note')->nullable();$table->timestamps();
 }); }
 public function down(): void {Schema::dropIfExists('netforge_bug_reports');}
};
