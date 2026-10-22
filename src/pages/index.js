import { useState } from "react";
import Head from "next/head";
import SearchTable from "../components/SearchTable";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { formatCnic, isValidCnic, normalizeCnic } from "../lib/cnic";

export default function Home() {
  const [cnic, setCnic] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [record, setRecord] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setCnic(formatCnic(event.target.value));
    if (fieldError) setFieldError("");
  };

  const handleSearch = async () => {
    setRecord(null);
    setNotFound(false);
    setServerError("");

    const normalized = normalizeCnic(cnic);
    if (!isValidCnic(normalized)) {
      setFieldError(
        "Enter a valid 13 digit CNIC, for example 35202-1234567-1. The first digit must be between 1 and 7."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?cnic=${encodeURIComponent(normalized)}`
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerError(
          result.error || "Something went wrong while checking. Please try again."
        );
        return;
      }

      if (result.found && result.record) {
        setRecord(result.record);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setServerError(
        "The checker could not be reached. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-emerald-950 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.svg')" }}
    >
      <Head>
        <title>Nigahban Ramadan Package, CNIC Eligibility Checker</title>
        <meta
          name="description"
          content="Unofficial community checker for the Punjab Nigahban Ramadan Package. Check a CNIC against the local eligibility list, or use the official SMS 8070 service."
        />
      </Head>

      <div className="flex flex-1 flex-col bg-white/85">
        <header className="border-b border-emerald-100 bg-white/90">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-8 text-center">
            <img
              src="/logo.svg"
              alt="Nigahban Ramadan Package"
              className="h-16 w-auto"
            />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Nigahban Ramadan Package
            </h1>
            <p dir="rtl" lang="ur" className="mt-1 text-xl text-emerald-800">
              نگہبان رمضان پیکج
            </p>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Check whether a CNIC is on the eligibility list for the Punjab
              Nigahban Ramadan Package.
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          <section
            aria-label="CNIC eligibility checker"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4">
              <InputField
                label="CNIC number"
                value={cnic}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="35202-1234567-1"
                error={fieldError}
              />
              <Button
                text="Check eligibility"
                onClick={handleSearch}
                isLoading={loading}
              />
              <p className="text-xs text-slate-500">
                Your CNIC is checked on the server against a local list. Only
                the matching record, if any, is returned. This demo ships with
                sample data only.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4" aria-live="polite">
              {record ? (
                <>
                  <div
                    role="status"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900"
                  >
                    <p className="font-semibold">
                      This CNIC was found on the eligibility list.
                    </p>
                    <p className="mt-1 text-sm">
                      Please follow the official instructions for the package
                      and wait for guidance from your Union Council. Confirm
                      the result through the official channel below before
                      relying on it.
                    </p>
                  </div>
                  <SearchTable data={record} />
                </>
              ) : null}

              {notFound ? (
                <div
                  role="status"
                  className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900"
                >
                  <p className="font-semibold">
                    This CNIC was not found on the list used by this checker.
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li>Check the CNIC digits and try again.</li>
                    <li>
                      Lists can be partial or out of date, so a missing record
                      here does not decide your eligibility.
                    </li>
                    <li>
                      Confirm through the official channel: SMS your CNIC to
                      8070.
                    </li>
                    <li>
                      If you still need help, contact your local Union Council.
                    </li>
                  </ul>
                </div>
              ) : null}

              {serverError ? (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-900"
                >
                  <p className="font-semibold">The check could not be completed.</p>
                  <p className="mt-1 text-sm">{serverError}</p>
                </div>
              ) : null}
            </div>
          </section>

          <section
            aria-label="How the official check works"
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              How the official check works
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
              <li>Open the SMS app on your mobile phone.</li>
              <li>Type your 13 digit CNIC number without dashes.</li>
              <li>
                Send it to <strong>8070</strong>, the Punjab government&apos;s
                official SMS channel for this programme.
              </li>
              <li>
                The reply message from the government channel is your official
                result.
              </li>
            </ol>
            <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <strong>Disclaimer:</strong> this is an unofficial community tool.
              It is not affiliated with the Government of Punjab. The official
              result is always the one issued through the government channel
              (SMS 8070).
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-200 bg-white/90">
          <div className="mx-auto w-full max-w-3xl px-4 py-5 text-center text-xs text-slate-500">
            <p>
              Nigahban Ramadan Package eligibility checker. Unofficial
              community tool, not affiliated with the Government of Punjab.
              Official channel: SMS your CNIC to 8070.
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()} Amir Hussain. Sample data only in
              this public version.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
