import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <footer className="bg-black text-white pt-24 pb-12 overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <h3 className="text-2xl font-bold mb-6">
              神經元 元智大學第29屆畢業展
            </h3>
            <p className="text-gray-400 max-w-sm">
              資傳系是理性框架與感性溫度的交匯。當結構遇上細節，創意便在神經元的訊號轉譯間誕生，建構出一張共鳴與創新交織的思維網絡。
            </p>
          </div>
          <div className="flex flex-col md:items-end space-y-4">
            <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-2">
              社群連結
            </h4>
            <a
              href="https://www.instagram.com/yzuic_29/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-neon)] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.threads.com/@yzuic_29"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-neon)] transition-colors"
            >
              Threads
            </a>
            <a
              href="https://lin.ee/sFMgbgw"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-neon)] transition-colors"
            >
              LINE
            </a>
          </div>
        </div>

        <div className="flex justify-center items-center w-full relative group cursor-pointer select-none">
          <svg
            className="w-full max-w-5xl footer-logo-svg transition-all duration-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1820.03 394.12"
          >
            <g>
              <g>
                <path d="M1212.69,30.32V0h-394.63v30.32h94.39l-93.79,121.27,93.79,121.27h-93.88v30.32h181.9v60.63h-181.9v30.32h394.11v-30.32h-181.9v-60.63h181.9v-30.32h-38.1l-94.99-121.27,94.99-121.27h38.1ZM1024.51,30.32l-19.95,25.47-19.95-25.47h39.91ZM1041.22,151.58l-36.66,46.79-36.66-46.79,36.66-46.79,36.66,46.79ZM948.45,33.16l36.92,47.12-36.66,46.79-36.68-46.83,36.42-47.09ZM856.86,151.58l36.1-46.67,36.56,46.67-36.56,46.67-36.1-46.67ZM948.45,270l-36.42-47.09,36.68-46.83,36.66,46.79-36.92,47.12ZM984.61,272.85l19.95-25.47,19.95,25.47h-39.91ZM1136.21,272.85h-73.31l-39.14-49.97,36.66-46.79,75.8,96.77ZM1060.41,127.08l-36.66-46.79,39.14-49.97h73.31l-75.8,96.77Z" />
                <rect x="606.36" y="333.48" width="121.27" height="30.32" />
                <polygon points="775.23 242.48 759.73 242.48 668.61 242.48 818.06 52.82 779.6 52.82 724.7 122.48 668.61 122.48 765.13 0 726.66 0 606.33 152.7 700.9 152.7 606.33 272.69 752.45 272.69 787.14 394.12 818.56 394.12 783.87 272.69 775.23 242.48" />
              </g>
              <g>
                <rect x="1244.01" width="545.7" height="30.32" />
                <polygon points="1789.71 212.22 1789.71 363.8 1607.81 363.8 1607.81 181.9 1820.03 181.9 1820.03 151.58 1421.87 151.58 1421.87 151.58 1402.68 151.58 1402.68 151.58 1214.72 151.58 1214.72 181.9 1378.93 181.9 1212.69 394.12 1251.08 394.12 1417.31 181.9 1577.49 181.9 1577.49 363.8 1577.49 394.12 1820.03 394.12 1820.03 363.8 1820.03 212.22 1789.71 212.22" />
              </g>
              <g>
                <path d="M424.43,75.79V0h-30.32v75.79h-181.9v227.38h181.9v90.95h30.32v-90.95h181.9V75.79h-181.9ZM244.07,106.11h150.04v45.47h-150.04v-45.47ZM244.07,272.85v-90.95h150.04v90.95h-150.04ZM574.48,272.85h-150.04v-90.95h150.04v90.95ZM574.48,151.58h-150.04v-45.47h150.04v45.47Z" />
                <polygon points="211.18 89.74 142.09 0 103.96 0 162.32 75.79 0 75.79 0 106.11 166.79 106.11 .02 394.12 34.93 394.12 90.95 297.37 90.95 394.12 121.27 394.12 121.27 296.64 177.71 394.12 212.63 394.12 123.78 240.68 211.18 89.74" />
              </g>
            </g>
          </svg>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2026 神經元展覽. 保留所有權利.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/info" className="hover:text-white">
              隱私權政策
            </Link>
            <Link to="/contact" className="hover:text-white">
              聯絡我們
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
