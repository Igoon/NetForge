<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class NetForgePlayerSyncController extends Controller
{
    private const ALLOWED = [
        'netforge.mission.autosave.v031',
        'netforge.guided.history.v027',
        'netforge.unified.mission.progress.v1',
        'netforge.player.settings.v030',
        'netforge.lab.autosave.v031',
    ];

    public function show(Request $request)
    {
        $row = DB::table('netforge_player_sync')->where('user_id', $request->user()->id)->first();
        return response()->json([
            'revision' => (int) ($row->revision ?? 0),
            'records' => $row ? json_decode($row->records_json, true) : new \stdClass(),
            'updated_at' => $row->updated_at ?? null,
        ])->header('Cache-Control', 'no-store');
    }

    public function upsert(Request $request)
    {
        $data = $request->validate([
            'revision' => 'required|integer|min:0',
            'records' => 'required|array|max:5',
        ]);
        $records = $data['records'];
        foreach ($records as $key => $value) {
            if (!in_array($key, self::ALLOWED, true) || !is_array($value)) {
                throw ValidationException::withMessages(['records' => 'Tipe data progres tidak valid.']);
            }
        }
        if (isset($records['netforge.guided.history.v027']) && !array_is_list($records['netforge.guided.history.v027'])) {
            throw ValidationException::withMessages(['records' => 'Riwayat Guided Lab harus berupa array.']);
        }
        if (isset($records['netforge.mission.autosave.v031']) &&
            (($records['netforge.mission.autosave.v031']['format'] ?? '') !== 'NETFORGE-MISSION' ||
             ($records['netforge.mission.autosave.v031']['schema'] ?? null) !== 1)) {
            throw ValidationException::withMessages(['records' => 'Snapshot misi tidak valid.']);
        }
        $json = json_encode($records, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        if (strlen($json) > 350000) throw ValidationException::withMessages(['records' => 'Progres melewati batas ukuran.']);
        return DB::transaction(function () use ($request, $data, $json) {
            $id = $request->user()->id;
            // Unique user_id and row lock prevent lost updates for existing records.
            $row = DB::table('netforge_player_sync')->where('user_id', $id)->lockForUpdate()->first();
            $revision = (int) ($row->revision ?? 0);
            if ($revision !== (int) $data['revision']) {
                return response()->json(['message' => 'Progres di server berubah. Muat dan bandingkan ulang.', 'revision' => $revision], 409);
            }
            if ($row) {
                DB::table('netforge_player_sync')->where('user_id', $id)->update(['records_json' => $json, 'revision' => $revision + 1, 'updated_at' => now()]);
            } else {
                DB::table('netforge_player_sync')->insert(['user_id' => $id, 'records_json' => $json, 'revision' => 1, 'created_at' => now(), 'updated_at' => now()]);
            }
            return response()->json(['revision' => $revision + 1, 'saved' => true]);
        });
    }
}
