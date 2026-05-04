export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-10 py-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">

        {/* Left — Brand + Copyright */}
        <div className="flex flex-col gap-2">
          <span className="text-[15px] font-bold text-[#1e2d4d] tracking-tight">
           Qoute Experts
          </span>
          <span className="text-[12px] text-gray-400">
            Copyright &copy; 2026 Qoute Experts. All rights reserved.
          </span>
        </div>

        {/* Right — Contact Info */}
        <div className="flex flex-col gap-1.5 text-right">
          <span className="text-[13px] text-gray-500">
            1000 Main St Suite 2300, Houston, TX 77002
          </span>
          <a
            href="mailto:info@qouteexperts.com"
            className="text-[13px] text-blue-600 hover:underline"
          >
            info@qouteexperts.com
          </a>
          <a
            href="tel:4436877049"
            className="text-[13px] text-gray-500 hover:text-gray-700"
          >
            443-687-7049
          </a>
        </div>

      </div>

      {/* Bottom bar */}
      {/* <div className="border-t border-gray-200 py-3 px-10">
        <p className="text-[11px] text-gray-400 text-center">
          This site is not affiliated with or endorsed by any government agency.
        </p>
      </div> */}
    </footer>
  );
}