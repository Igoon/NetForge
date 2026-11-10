interface OfficeRoomArtProps {
  cableTray: boolean
  ups: boolean
  tier: number
}

function Monitor({ x, y, accent }: { x: number; y: number; accent: string }) {
  return (
    <g>
      <rect x={x} y={y} width="98" height="64" fill="#2f3a48" />
      <rect x={x + 5} y={y + 5} width="88" height="48" fill="#d9f0e7" />
      <rect x={x + 12} y={y + 13} width="18" height="12" fill={accent} />
      <rect x={x + 40} y={y + 13} width="18" height="12" fill="#7dd3fc" />
      <rect x={x + 68} y={y + 13} width="18" height="12" fill="#fbbf24" />
      <rect x={x + 24} y={y + 29} width="12" height="3" fill="#58756b" />
      <rect x={x + 38} y={y + 29} width="12" height="3" fill="#58756b" />
      <rect x={x + 52} y={y + 29} width="12" height="3" fill="#58756b" />
      <rect x={x + 38} y={y + 56} width="22" height="5" fill="#1f2936" />
      <rect x={x + 28} y={y + 61} width="42" height="4" fill="#6c5a48" />
    </g>
  )
}

function Desk({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x + 8} y={y + 14} width="210" height="10" fill="#b79a74" />
      <rect x={x + 8} y={y + 24} width="210" height="6" fill="#8e7355" />
      <rect x={x + 22} y={y + 30} width="10" height="64" fill="#6c5a48" />
      <rect x={x + 194} y={y + 30} width="10" height="64" fill="#6c5a48" />
      <rect x={x + 132} y={y + 34} width="54" height="38" fill="#8e7355" />
      <rect x={x + 138} y={y + 40} width="42" height="6" fill="#b79a74" />
      <rect x={x + 138} y={y + 50} width="42" height="6" fill="#b79a74" />
      <rect x={x + 138} y={y + 60} width="42" height="6" fill="#b79a74" />
    </g>
  )
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x + 8} y={y + 34} width="30" height="30" fill="#b7791f" />
      <rect x={x + 4} y={y + 30} width="38" height="7" fill="#d18b2c" />
      <rect x={x + 15} y={y + 4} width="8" height="28" fill="#4d7c0f" />
      <rect x={x + 2} y={y + 12} width="16" height="8" fill="#65a30d" />
      <rect x={x + 22} y={y + 8} width="16" height="8" fill="#65a30d" />
      <rect x={x + 10} y={y + 24} width="12" height="8" fill="#3f6212" />
      <rect x={x + 28} y={y + 20} width="12" height="8" fill="#4d7c0f" />
    </g>
  )
}

function Cat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x + 13} y={y + 17} width="30" height="14" fill="#6b5b95" />
      <rect x={x + 22} y={y + 9} width="18" height="14" fill="#7e6aa8" />
      <rect x={x + 23} y={y + 3} width="5" height="8" fill="#6b5b95" />
      <rect x={x + 34} y={y + 3} width="5" height="8" fill="#6b5b95" />
      <rect x={x + 25} y={y + 4} width="2" height="5" fill="#e8b98c" />
      <rect x={x + 35} y={y + 4} width="2" height="5" fill="#e8b98c" />
      <rect x={x + 26} y={y + 13} width="3" height="2" fill="#1f2936" />
      <rect x={x + 34} y={y + 13} width="3" height="2" fill="#1f2936" />
      <rect x={x + 30} y={y + 17} width="3" height="2" fill="#e8b98c" />
      <rect x={x + 43} y={y + 22} width="16" height="5" fill="#6b5b95" />
      <rect x={x + 54} y={y + 19} width="5" height="5" fill="#6b5b95" />
    </g>
  )
}

export function OfficeRoomArt({
  cableTray,
  ups,
  tier,
}: OfficeRoomArtProps) {
  return (
    <svg
      className="office-room-art"
      viewBox="0 0 960 540"
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id="office-floor"
          width="64"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <rect width="64" height="32" fill="#d7e3d4" />
          <rect width="32" height="16" fill="#ceddcc" />
          <rect x="32" y="16" width="32" height="16" fill="#ceddcc" />
          <rect x="32" width="1" height="32" fill="#bfd0be" />
          <rect y="16" width="64" height="1" fill="#bfd0be" />
        </pattern>
        <pattern
          id="office-wall"
          width="96"
          height="44"
          patternUnits="userSpaceOnUse"
        >
          <rect width="96" height="44" fill="#f4ecdc" />
          <rect y="42" width="96" height="2" fill="#e7dcc8" />
          <rect x="94" width="2" height="44" fill="#e7dcc8" />
        </pattern>
      </defs>

      <rect width="960" height="540" fill="#f4ecdc" />
      <rect width="960" height="320" fill="url(#office-wall)" />
      <rect y="314" width="960" height="226" fill="url(#office-floor)" />
      <rect y="306" width="960" height="14" fill="#bea988" />
      <rect y="320" width="960" height="5" fill="#a99272" opacity=".45" />
      <rect y="0" width="960" height="12" fill="#6c5a48" />
      <rect y="12" width="960" height="5" fill="#8e7355" />

      <g>
        <rect x="68" y="62" width="214" height="152" fill="#6c5a48" />
        <rect x="76" y="70" width="198" height="136" fill="#b9dce5" />
        <rect x="80" y="74" width="190" height="58" fill="#c9e8ef" />
        <rect x="96" y="88" width="46" height="12" fill="#eef7f4" />
        <rect x="108" y="82" width="26" height="10" fill="#eef7f4" />
        <rect x="192" y="105" width="56" height="12" fill="#eef7f4" />
        <rect x="204" y="99" width="28" height="10" fill="#eef7f4" />
        <rect x="76" y="166" width="198" height="40" fill="#8ab39c" />
        <rect x="76" y="176" width="198" height="30" fill="#719d87" />
        <rect x="82" y="156" width="18" height="50" fill="#5f8b77" />
        <rect x="112" y="148" width="26" height="58" fill="#6d9780" />
        <rect x="150" y="160" width="20" height="46" fill="#5f8b77" />
        <rect x="182" y="152" width="28" height="54" fill="#6d9780" />
        <rect x="226" y="158" width="22" height="48" fill="#5f8b77" />
        <rect x="76" y="132" width="198" height="4" fill="#6c5a48" opacity=".55" />
        <rect x="76" y="202" width="198" height="4" fill="#6c5a48" opacity=".55" />
        <rect x="118" y="62" width="5" height="152" fill="#8e7355" />
        <rect x="216" y="62" width="5" height="152" fill="#8e7355" />
      </g>

      <g>
        <rect x="315" y="78" width="82" height="82" fill="#6c5a48" />
        <rect x="323" y="86" width="66" height="66" fill="#f8f5ed" />
        <rect x="343" y="98" width="26" height="26" fill="none" stroke="#2f3a48" strokeWidth="4" />
        <rect x="355" y="92" width="4" height="38" fill="#2f3a48" />
        <rect x="349" y="110" width="16" height="4" fill="#2f3a48" />
        <rect x="333" y="132" width="8" height="8" fill="#0f766e" />
        <rect x="371" y="132" width="8" height="8" fill="#b7791f" />
      </g>

      <g>
        <rect x="410" y="76" width="206" height="146" fill="#2f3a48" />
        <rect x="418" y="84" width="190" height="130" fill="#c9b89c" />
        <rect x="426" y="92" width="82" height="48" fill="#f8f5ed" />
        <rect x="516" y="92" width="84" height="48" fill="#f8f5ed" />
        <rect x="426" y="148" width="82" height="58" fill="#f8f5ed" />
        <rect x="516" y="148" width="84" height="58" fill="#f8f5ed" />
        <rect x="434" y="102" width="44" height="5" fill="#0f766e" />
        <rect x="434" y="112" width="58" height="3" fill="#8b96a3" />
        <rect x="434" y="118" width="48" height="3" fill="#8b96a3" />
        <rect x="524" y="102" width="54" height="5" fill="#b7791f" />
        <rect x="524" y="112" width="40" height="3" fill="#8b96a3" />
        <rect x="434" y="158" width="48" height="5" fill="#3d7ea6" />
        <rect x="434" y="168" width="56" height="3" fill="#8b96a3" />
        <rect x="434" y="176" width="36" height="3" fill="#8b96a3" />
        <rect x="524" y="158" width="52" height="5" fill="#6b5b95" />
        <rect x="524" y="168" width="56" height="3" fill="#8b96a3" />
        <rect x="524" y="176" width="34" height="3" fill="#8b96a3" />
        <rect x="500" y="72" width="6" height="10" fill="#6c5a48" />
        <rect x="460" y="70" width="106" height="6" fill="#6c5a48" />
      </g>

      <g>
        <rect x="670" y="70" width="150" height="104" fill="#6c5a48" />
        <rect x="678" y="78" width="134" height="88" fill="#f8f5ed" />
        <rect x="698" y="98" width="16" height="16" fill="#0f766e" />
        <rect x="766" y="98" width="16" height="16" fill="#0f766e" />
        <rect x="732" y="136" width="16" height="16" fill="#3d7ea6" />
        <rect x="712" y="104" width="58" height="3" fill="#7a8a86" />
        <rect x="742" y="140" width="58" height="3" fill="#7a8a86" />
        <rect x="714" y="104" width="3" height="34" fill="#7a8a86" />
        <rect x="764" y="104" width="3" height="34" fill="#7a8a86" />
      </g>

      <g>
        <rect x="720" y="194" width="166" height="12" fill="#8e7355" />
        <rect x="730" y="206" width="146" height="6" fill="#6c5a48" />
        <rect x="738" y="176" width="34" height="18" fill="#b7791f" />
        <rect x="778" y="170" width="24" height="24" fill="#3d7ea6" />
        <rect x="806" y="180" width="40" height="14" fill="#6b5b95" />
      </g>

      <g>
        <rect x="812" y="146" width="104" height="186" fill="#2f3a48" />
        <rect x="820" y="154" width="88" height="170" fill="#39424f" />
        <rect x="828" y="164" width="72" height="32" fill="#1f2936" />
        <rect x="828" y="204" width="72" height="32" fill="#1f2936" />
        <rect x="828" y="244" width="72" height="32" fill="#1f2936" />
        <rect x="828" y="284" width="72" height="32" fill="#1f2936" />
        <rect x="836" y="174" width="20" height="5" fill="#7dd3fc" />
        <rect x="836" y="214" width="20" height="5" fill="#7dd3fc" />
        <rect x="836" y="254" width="20" height="5" fill="#7dd3fc" />
        <rect x="836" y="294" width="20" height="5" fill="#7dd3fc" />
        <rect className="pixel-led" x="884" y="174" width="7" height="7" fill="#a3e635" />
        <rect className="pixel-led is-slow" x="884" y="214" width="7" height="7" fill="#a3e635" />
        <rect className="pixel-led" x="884" y="254" width="7" height="7" fill="#a3e635" />
        <rect className="pixel-led is-slow" x="884" y="294" width="7" height="7" fill="#a3e635" />
        <rect x="832" y="322" width="8" height="28" fill="#1f2936" />
        <rect x="888" y="322" width="8" height="28" fill="#1f2936" />
      </g>

      <g>
        <Desk x={74} y={210} />
        <Monitor x={114} y={146} accent="#0f766e" />
        <rect x="86" y="214" width="34" height="5" fill="#e7e2d7" />
        <rect x="88" y="208" width="22" height="6" fill="#f8f5ed" />
        <rect x="82" y="200" width="10" height="14" fill="#b7791f" />
        <rect x="86" y="196" width="4" height="5" fill="#f8f5ed" />
      </g>

      <g>
        <Desk x={632} y={210} />
        <Monitor x={674} y={146} accent="#6b5b95" />
        <rect x="646" y="214" width="22" height="5" fill="#0f766e" />
        <rect x="650" y="206" width="14" height="8" fill="#e7e2d7" />
        <rect x="760" y="208" width="24" height="6" fill="#f8f5ed" />
        <rect x="768" y="202" width="8" height="6" fill="#b7791f" />
        <rect x="772" y="198" width="2" height="5" fill="#f8f5ed" />
      </g>

      <g>
        <rect x="102" y="324" width="100" height="8" fill="#6c5a48" />
        <rect x="108" y="332" width="88" height="50" fill="#8e7355" />
        <rect x="114" y="338" width="76" height="38" fill="#6c5a48" />
        <rect x="122" y="344" width="60" height="26" fill="#3d7ea6" />
        <rect x="128" y="350" width="48" height="4" fill="#b9dce5" />
        <rect x="128" y="358" width="34" height="4" fill="#b9dce5" />
      </g>

      <g>
        <rect x="558" y="324" width="82" height="8" fill="#6c5a48" />
        <rect x="564" y="332" width="70" height="44" fill="#8e7355" />
        <rect x="570" y="338" width="58" height="32" fill="#6c5a48" />
        <rect x="576" y="344" width="46" height="20" fill="#f8f5ed" />
        <rect x="580" y="348" width="28" height="3" fill="#8b96a3" />
        <rect x="580" y="354" width="36" height="3" fill="#8b96a3" />
      </g>

      <rect x="352" y="380" width="256" height="100" fill="#c5d6c5" />
      <rect x="364" y="390" width="232" height="80" fill="#d5e3d1" />
      <rect x="384" y="404" width="192" height="52" fill="#bfd0be" />

      {cableTray ? (
        <>
          <rect x="300" y="492" width="360" height="10" fill="#6c5a48" />
          <rect x="310" y="486" width="120" height="5" fill="#0f766e" />
          <rect x="438" y="486" width="108" height="5" fill="#0f766e" />
          <rect x="554" y="486" width="92" height="5" fill="#0f766e" />
        </>
      ) : null}

      {ups ? (
        <>
          <rect x="772" y="330" width="38" height="54" fill="#0f766e" />
          <rect x="778" y="338" width="26" height="12" fill="#5eead4" />
          <rect x="780" y="358" width="10" height="4" fill="#f8f5ed" />
          <rect x="794" y="358" width="6" height="4" fill="#fbbf24" />
          <rect x="780" y="368" width="22" height="4" fill="#134e4a" />
        </>
      ) : null}

      {tier >= 1 ? (
        <g>
          <rect x="300" y="178" width="36" height="42" fill="#6c5a48" />
          <rect x="305" y="183" width="26" height="32" fill="#f8f5ed" />
          <rect x="309" y="188" width="18" height="12" fill="#b7791f" />
          <rect x="311" y="203" width="14" height="3" fill="#8b96a3" />
          <rect x="311" y="209" width="10" height="3" fill="#8b96a3" />
          <rect x="344" y="178" width="36" height="42" fill="#6c5a48" />
          <rect x="349" y="183" width="26" height="32" fill="#f8f5ed" />
          <rect x="353" y="188" width="18" height="12" fill="#3d7ea6" />
          <rect x="355" y="203" width="14" height="3" fill="#8b96a3" />
          <rect x="355" y="209" width="10" height="3" fill="#8b96a3" />
        </g>
      ) : null}

      {tier >= 2 ? (
        <g>
          <rect x="294" y="224" width="94" height="7" fill="#8e7355" />
          <rect x="302" y="231" width="7" height="14" fill="#6c5a48" />
          <rect x="373" y="231" width="7" height="14" fill="#6c5a48" />
          <rect x="330" y="202" width="4" height="16" fill="#b7791f" />
          <rect x="322" y="198" width="20" height="6" fill="#fbbf24" />
          <rect x="326" y="194" width="12" height="4" fill="#fde68a" />
          <rect x="336" y="204" width="10" height="2" fill="#fbbf24" />
          <rect x="342" y="200" width="2" height="8" fill="#fbbf24" />
        </g>
      ) : null}

      {tier >= 3 ? (
        <g>
          <rect x="468" y="58" width="22" height="10" fill="#b7791f" />
          <rect x="472" y="54" width="14" height="6" fill="#fbbf24" />
          <rect x="496" y="53" width="22" height="15" fill="#b7791f" />
          <rect x="500" y="48" width="14" height="7" fill="#fde68a" />
          <rect x="524" y="58" width="22" height="10" fill="#b7791f" />
          <rect x="528" y="54" width="14" height="6" fill="#fbbf24" />
        </g>
      ) : null}

      <Plant x={36} y={210} />
      <Plant x={902} y={214} />
      <Cat x={594} y={454} />

      <g>
        <rect x="318" y="238" width="46" height="58" fill="#b79a74" />
        <rect x="322" y="242" width="38" height="10" fill="#6c5a48" />
        <rect x="322" y="256" width="38" height="10" fill="#6c5a48" />
        <rect x="322" y="270" width="38" height="10" fill="#6c5a48" />
        <rect x="322" y="284" width="38" height="8" fill="#6c5a48" />
      </g>

      <g>
        <rect x="492" y="194" width="84" height="8" fill="#8e7355" />
        <rect x="500" y="202" width="10" height="18" fill="#6c5a48" />
        <rect x="558" y="202" width="10" height="18" fill="#6c5a48" />
        <rect x="516" y="184" width="36" height="10" fill="#b7791f" />
        <rect x="522" y="176" width="24" height="8" fill="#f8f5ed" />
        <rect x="526" y="180" width="16" height="3" fill="#8b96a3" />
      </g>
    </svg>
  )
}
