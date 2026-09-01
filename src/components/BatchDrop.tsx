import { useRef, useState } from "react";
import { CheckCircle2, FileSpreadsheet, FileUp, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { fmtNum, SITE } from "../lib/site";
import { Btn } from "./ui";
import { cn } from "../utils/cn";

interface F {
  name: string;
  size: number;
}

const inputCls =
  "w-full min-w-0 border border-line-2 bg-ink px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-dim focus:border-brand";

export function BatchDrop({ compact = false }: { compact?: boolean }) {
  const [files, setFiles] = useState<F[]>([]);
  const [over, setOver] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (list: FileList | null) => {
    if (!list?.length) return;
    setFiles((p) => [...p, ...Array.from(list).map((f) => ({ name: f.name, size: f.size }))]);
  };

  /** телефон (от 10 цифр) или e-mail */
  const contactValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.trim()) ||
    contact.replace(/\D/g, "").length >= 10;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValid) {
      setErr("Укажите телефон или e-mail — иначе инженер не сможет прислать ТКП.");
      return;
    }
    if (!consent) {
      setErr("Требуется согласие на обработку персональных данных.");
      return;
    }
    setErr("");
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  };

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden border-2 border-dashed transition-colors duration-300",
        over ? "border-brand bg-brand/8" : "border-line-2 bg-ink-2",
        compact ? "p-4 sm:p-6" : "p-5 sm:p-8 lg:p-10",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        add(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".xlsx,.xls,.csv,.pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />

      {!sent ? (
        <>
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <span className={cn("absolute inset-0 border border-brand/60", over && "anim-ring")} />
              <div className="border border-line-2 bg-ink p-4">
                <FileUp className={cn("h-8 w-8 transition-colors", over ? "text-brand" : "text-steel")} />
              </div>
            </div>
            <h3 className="h-display mt-5 text-lg text-white sm:text-xl">
              Есть готовая дефектная ведомость или Excel-заявка?
            </h3>
            <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-steel">
              Перетащите файл сюда — не нужно вбивать 40 позиций вручную. Инженер АСТ разберёт ведомость,
              подберёт оригинальные позиции по каталожным номерам и пришлёт готовое ТКП{" "}
              <b className="text-fog">в течение 24 часов</b>.
            </p>
            <div className="mt-5 grid w-full gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
              <Btn onClick={() => inputRef.current?.click()} className="w-full sm:w-auto">
                <FileSpreadsheet className="h-4 w-4" /> Выбрать файл
              </Btn>
              <span className="text-center text-[11px] uppercase tracking-[0.16em] text-dim">
                xlsx · csv · pdf · doc · jpg · zip — до 25 МБ
              </span>
            </div>
          </div>

          {files.length > 0 && (
            <form onSubmit={submit} className="mx-auto mt-7 w-full max-w-2xl min-w-0 border border-line bg-ink p-4">
              <div className="grid min-w-0 gap-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex min-w-0 items-center gap-3 border border-line/70 bg-ink-2 px-3 py-2.5 text-[12.5px]"
                  >
                    <FileSpreadsheet className="h-4 w-4 shrink-0 text-brand" />
                    <span className="min-w-0 flex-1 truncate text-fog" title={f.name}>
                      {f.name}
                    </span>
                    <span className="shrink-0 text-dim tnum">{fmtNum(Math.round(f.size / 1024))} КБ</span>
                    <button
                      type="button"
                      onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                      className="shrink-0 cursor-pointer text-dim transition-colors hover:text-brand"
                      aria-label="Убрать файл"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* обязательный контакт для ответа */}
              <div className="mt-5 border-t border-line pt-5">
                <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-brand">
                  <span className="h-px w-6 bg-brand" />
                  Куда прислать ТКП
                </div>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Имя и компания"
                    className={inputCls}
                    aria-label="Имя и компания"
                  />
                  <input
                    required
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      setErr("");
                    }}
                    placeholder="Телефон или e-mail *"
                    className={cn(inputCls, err && !contactValid && "border-brand")}
                    aria-label="Телефон или e-mail для ответа"
                  />
                </div>
                <label className="mt-3 flex cursor-pointer items-start gap-3 text-[12px] leading-relaxed text-steel">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#FF6B00]"
                  />
                  <span>
                    Я соглашаюсь с{" "}
                    <a href="#/privacy" className="text-brand underline underline-offset-2">
                      Политикой конфиденциальности
                    </a>{" "}
                    и даю согласие на обработку персональных данных (ФЗ № 152).
                  </span>
                </label>
                {err && <p className="mt-3 text-[12.5px] text-brand-2">{err}</p>}
              </div>

              <div className="btn-row mt-5">
                <Btn>
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Отправка…
                    </>
                  ) : (
                    "Отправить на разбор инженеру"
                  )}
                </Btn>
                <span className="break-words text-[11.5px] text-dim">
                  или продублируйте файл на{" "}
                  <a href={`mailto:${SITE.email}`} className="text-brand-2 underline underline-offset-2">
                    {SITE.email}
                  </a>
                </span>
              </div>
            </form>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-ok" />
          <h3 className="h-display mt-5 text-lg text-white">Файлы переданы инженеру</h3>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-steel">
            Ведомость ({files.length} файл.) встала в очередь разбора. ТКП по позициям придёт на{" "}
            <b className="text-fog">{contact}</b> <b className="text-fog">в течение 24 часов</b>.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11.5px] text-dim">
            <ShieldCheck className="h-4 w-4 text-ok" />
            Данные обрабатываются в дата-центрах на территории РФ
          </div>
          <button
            onClick={() => {
              setSent(false);
              setFiles([]);
              setContact("");
              setName("");
            }}
            className="mt-5 cursor-pointer text-[11px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-brand"
          >
            отправить ещё ведомость
          </button>
        </div>
      )}
    </div>
  );
}
