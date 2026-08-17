import React from 'react'
import { Helmet } from 'react-helmet-async'
import './GoodNews.css'

/* ===== SHARED GEOMETRY =====
   Everything lives in the 0 0 1000 880 viewBox so routes, anchors, airports,
   and pins all stay aligned. The silhouette is traced from real US Census /
   state boundary GeoJSON (glynnbird/usstatesgeojson — Michigan), simplified
   hard with Douglas-Peucker (LP 1674→130 pts, UP 2056→170 pts) and projected
   with an equirectangular fit (lat0 44.58°) into this viewBox. PLACES/AIRPORTS
   are the SAME real lat/longs projected through the SAME transform, so every
   city sits on the true coastline. To regenerate: simplify the Michigan
   GeoJSON with Douglas-Peucker, then project lon*cos(lat0)/lat into this
   viewBox (lat0 = mid-latitude of the kept peninsulas). */
const PLACES = {
  newBuffalo: { x: 468, y: 822 },
  kalamazoo: { x: 581, y: 754 },
  grandRapids: { x: 573, y: 662 },
  traverseCity: { x: 578, y: 416 },
  annArbor: { x: 760, y: 755 },
  detroit: { x: 828, y: 748 },
  roscommon: { x: 678, y: 452 }, // golf country (Forest Dunes)
  marquette: { x: 405, y: 172 }, // UP (Greywalls)
}
const AIRPORTS = {
  GRR: { x: 587, y: 673 },
  DTW: { x: 798, y: 765 },
}

/* Traced + simplified Michigan silhouette (Lower + Upper peninsula). */
const LOWER_PENINSULA =
  'M 796.5 810.7 L 790 819 L 791.5 828.9 L 788.6 830 L 656.9 835 L 655.6 826.3 L 460.3 826.2 L 480.3 808 L 493.4 777.3 L 505.9 758.7 L 515.1 732.7 L 518.6 712.1 L 520.5 695.1 L 518 654.5 L 487.9 570.1 L 498.6 545.1 L 495.5 523.9 L 490.5 512 L 499.6 502.2 L 514.4 472.7 L 519.1 442.5 L 515.8 425.3 L 531.9 418.6 L 534.1 396.1 L 541.3 396.9 L 547.3 387.5 L 553.3 391.5 L 559.4 390.1 L 577.8 357.7 L 584.3 354.4 L 586.2 359 L 578.2 365.8 L 582.9 377.2 L 577.4 382.6 L 579.4 393.2 L 574.5 403.8 L 575.6 413.9 L 580.2 414.8 L 586.1 400.5 L 583 397.5 L 587.4 386.8 L 591.7 384.4 L 589.1 402.9 L 583.9 408.1 L 581.9 416 L 586.7 417.6 L 599.5 392.6 L 602.3 373.8 L 601.8 346.2 L 618.8 333.9 L 634.8 333.8 L 646.2 329.5 L 645.6 325.5 L 634 323.5 L 626.8 309.4 L 630.7 297.2 L 643.5 286.1 L 636.6 279.2 L 656.8 281.2 L 659.3 279.1 L 658.2 276.5 L 663.9 275.4 L 690.4 294 L 703.3 292.4 L 714.4 296.4 L 726.1 315.2 L 741.3 315.8 L 774.4 335 L 785.2 334.5 L 795.6 346.4 L 792.6 350.5 L 802 363.8 L 806.9 379.5 L 793.9 373.6 L 788.6 378.9 L 790.6 392.4 L 801.6 399.5 L 806.2 422.3 L 802.2 436.7 L 800.4 473.4 L 790.9 483.1 L 784.1 482.1 L 780.4 486 L 775.9 512.2 L 766.6 515 L 766.6 520.7 L 752 521.4 L 747.3 525.5 L 743.5 533.8 L 742.3 550.4 L 739.7 552.9 L 744.2 564.7 L 767.9 575.8 L 780.2 559.8 L 787 557.8 L 793.1 542.9 L 800.4 536.3 L 799 532 L 807.3 523.6 L 826.4 519.5 L 836 510.9 L 841 510.3 L 857.5 520.5 L 868.5 543 L 871.9 576 L 877.6 596.9 L 879.2 625.9 L 882.8 642.7 L 889.7 655.9 L 884.4 672.1 L 880.5 706.3 L 873.3 717.7 L 863.3 722.5 L 865.5 718.7 L 860.7 711.7 L 868.7 705.6 L 868.7 701.4 L 861.9 699.2 L 851 705.8 L 854 716.2 L 848.9 715.8 L 845 721.9 L 843.1 740.2 L 840.2 745.3 L 825 751.2 L 820.3 760.8 L 819.8 781.4 L 814.4 784.4 L 814.6 792.4 L 796.5 810.7 Z'
const UPPER_PENINSULA =
  'M 255 236.4 L 236.3 226.7 L 139.3 200.4 L 131.1 181 L 110.3 169.1 L 148.3 154.2 L 171.4 134.5 L 208 131.1 L 226.2 121.6 L 235.9 110.7 L 251.1 109.4 L 259.2 96 L 289.9 76.1 L 305.1 59 L 324.6 48.4 L 365.2 45 L 373.5 49.6 L 373.8 54.8 L 350 56.8 L 351.3 63.8 L 323.5 82.5 L 323.2 89.8 L 318.4 90.8 L 316.8 96.3 L 311.8 99.3 L 310 107.1 L 302.6 113.5 L 298.7 132.7 L 300.8 138.9 L 309.3 129.2 L 331.8 114.3 L 328.8 122.8 L 355.5 122.1 L 371.1 128.1 L 372.4 133.3 L 376.9 131.3 L 385.2 139.4 L 386.5 146.6 L 394.2 157.9 L 405.8 165.4 L 404.9 173.6 L 409 178 L 430.8 178.9 L 442.4 173.6 L 446.7 175.8 L 448.4 181.9 L 457.8 187.1 L 465.8 181 L 472.6 186.5 L 474 178.4 L 471.5 172.1 L 474.6 169.7 L 479.5 173.5 L 477.7 180 L 481.3 179.1 L 483.5 183.1 L 494.9 171.1 L 524.9 154.9 L 530.9 157 L 552.5 152 L 588.4 154.1 L 613 143.4 L 642.5 141 L 635.3 151.1 L 635.5 171.7 L 632.5 174.5 L 635.5 180.4 L 644.1 179.6 L 654.6 185.7 L 673.9 180.2 L 681.7 189.2 L 689.4 187.1 L 694.5 177.9 L 709.7 178.8 L 713.4 173.5 L 722.8 174 L 724.6 177.5 L 721.2 189.2 L 724.9 213.5 L 714 214.7 L 710.9 222.4 L 723.2 221.8 L 732.8 228.5 L 728.4 233.8 L 745.1 246.6 L 750.5 243 L 755.5 247 L 758.3 244 L 753.3 231.6 L 770.9 232.3 L 776.2 234.2 L 780.9 244.9 L 786.7 248.6 L 782.4 256.9 L 778.1 258.4 L 768.7 253.9 L 757.9 255.8 L 747 250.8 L 724.6 249.4 L 698.7 255.8 L 688.3 248.1 L 683.5 250.6 L 682.4 243.3 L 671.5 239.3 L 667.9 242.8 L 668.7 250.1 L 663.4 253.9 L 667.1 266.6 L 662.6 268.9 L 636.6 245 L 605.3 233.8 L 589.3 233.2 L 570.1 251.9 L 551 250.9 L 548.1 253.5 L 549 257.5 L 533.6 251.2 L 513.5 254.4 L 509 259.3 L 506.4 274.1 L 490.5 280.3 L 488.3 286.3 L 484 285.9 L 483.4 292.1 L 479.5 293.1 L 480.5 300.2 L 470.7 290.6 L 475.8 287.2 L 479.2 276.3 L 483.8 276.8 L 486.3 272.7 L 489.2 266 L 487.9 261.5 L 483.8 260.3 L 477.7 269.2 L 464.4 265.6 L 465.3 272.3 L 458.9 284.4 L 446.7 291.2 L 444.4 272.4 L 440.2 268.7 L 437.6 272.1 L 437.4 286.3 L 424.1 296.2 L 411.3 325.1 L 384.7 363.1 L 385.7 370.2 L 379 368.5 L 371 356.1 L 380.1 336.8 L 379.2 332.8 L 375.6 329.9 L 370 335.1 L 356.7 334.7 L 366 314.8 L 366.1 298.9 L 363 293 L 367.2 290.2 L 364.6 286.4 L 346.7 274.4 L 336.7 275.8 L 332.6 271.2 L 338.6 263.5 L 328.7 254 L 298.2 247.6 L 294 243.6 L 281 248.1 L 279.7 244.6 L 266.4 243.4 L 255 236.4 Z'

/* Four routes, re-fit to the traced coastline and de-tangled.
   status 'live' (solid) = validated/scouted; 'proposed' (dashed) = coming. */
const ROUTES = [
  {
    id: 'west-coast',
    name: 'The West Coast',
    color: '#5ab0c4',
    status: 'live',
    note: 'New Buffalo → Kalamazoo → Grand Rapids → Traverse City',
    d: 'M 468 822 Q 545 792 581 754 Q 590 708 573 662 Q 558 540 578 416',
  },
  {
    id: 'up-north',
    name: 'Up North',
    color: '#e8943a',
    status: 'live',
    note: 'Ann Arbor → the Upper Peninsula (bridging at the Straits)',
    d: 'M 760 755 Q 718 600 690 470 Q 672 360 663 277 L 665 264 Q 560 205 405 172',
  },
  {
    id: 'motor-city',
    name: 'Motor City',
    color: '#c073c0',
    status: 'proposed',
    note: 'Detroit · Corktown — proposed, validating soon',
    d: 'M 760 755 Q 800 743 828 748 Q 856 762 840 786 Q 812 802 790 788',
  },
  {
    id: 'harbor-golf',
    name: 'Harbor & Greens',
    color: '#7fc06a',
    status: 'proposed',
    note: 'Harbor Country + golf country — proposed, validating soon',
    d: 'M 468 822 Q 470 700 490 580 Q 505 500 518 453 Q 600 440 678 452',
  },
]

export default function GoodNews() {
  return (
    <div className="gn-root">
      <Helmet>
        <title>Good Brews · Good Views · Good News — Michigan | The Lads</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="gn-stage">
        <svg
          className="gn-map"
          viewBox="0 0 1000 880"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Illustrated map of Michigan with four road-trip routes"
        >
          <defs>
            <radialGradient id="gn-water" cx="50%" cy="42%" r="75%">
              <stop offset="0%" stopColor="#1c4a5e" />
              <stop offset="100%" stopColor="#0c2129" />
            </radialGradient>
            <linearGradient id="gn-land" x1="0" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#357a4a" />
              <stop offset="100%" stopColor="#1f4a2f" />
            </linearGradient>
            <filter id="gn-land-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.45" />
            </filter>
            <filter id="gn-route-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* water backdrop (Great Lakes feel) */}
          <rect x="0" y="0" width="1000" height="880" fill="url(#gn-water)" />

          {/* land — traced silhouette with depth shadow + coastline */}
          <g filter="url(#gn-land-shadow)">
            <path
              className="gn-land gn-up"
              d={UPPER_PENINSULA}
              fill="url(#gn-land)"
              stroke="#a6e0ab"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              className="gn-land gn-lp"
              d={LOWER_PENINSULA}
              fill="url(#gn-land)"
              stroke="#a6e0ab"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>

          {/* routes */}
          {ROUTES.map((r) => (
            <path
              key={r.id}
              className={`gn-route gn-route--${r.status}`}
              d={r.d}
              fill="none"
              stroke={r.color}
              strokeWidth={r.status === 'live' ? 5.5 : 4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={r.status === 'proposed' ? '2 12' : 'none'}
              filter={r.status === 'live' ? 'url(#gn-route-glow)' : undefined}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
