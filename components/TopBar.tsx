import { WhatsAppIcon } from "./WhatsAppIcon";

export function TopBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-wa px-3 py-2 text-center text-[13px] font-semibold leading-tight text-white">
      <span className="inline-flex items-center gap-1.5">
        <WhatsAppIcon className="h-4 w-4 shrink-0" />
        grupo gratuito no whatsapp
      </span>
      <span className="font-normal text-white/85">
        · achados de moda garimpados um por um
      </span>
    </div>
  );
}
