import { useId, useState } from "react";
import { US_STATES } from "../data/usStates";
import { CITY_SUGGESTIONS_BY_STATE, CITY_SUGGESTIONS_DEFAULT } from "../data/usCities";

const REMOTE = "Remote / Online";

function parseValue(value) {
  if (!value || value === REMOTE) return { city: "", state: "" };
  const parts = value.split(",").map((p) => p.trim());
  if (parts.length >= 2) return { city: parts[0], state: parts[1] };
  return { city: parts[0] || "", state: "" };
}

// Two-field city + state picker: state is a full 50-state dropdown, city is a
// free-text input with a datalist of that state's major cities for autosuggest.
// Reports back a single combined "City, ST" string (or "Remote / Online")
// so it drops into the existing city-string data model unchanged.
export default function CityStateField({
  value,
  onChange,
  cityLabel = "City",
  stateLabel = "State",
}) {
  const listId = useId();
  const initial = parseValue(value);
  const [city, setCity] = useState(initial.city);
  const [stateCode, setStateCode] = useState(initial.state);
  const [isRemote, setIsRemote] = useState(value === REMOTE);

  function commit(nextCity, nextState) {
    const combined = [nextCity.trim(), nextState].filter(Boolean).join(", ");
    onChange(combined);
  }

  function handleCityChange(e) {
    const v = e.target.value;
    setCity(v);
    commit(v, stateCode);
  }

  function handleStateChange(e) {
    const v = e.target.value;
    setStateCode(v);
    commit(city, v);
  }

  function toggleRemote() {
    const next = !isRemote;
    setIsRemote(next);
    onChange(next ? REMOTE : [city.trim(), stateCode].filter(Boolean).join(", "));
  }

  const suggestions = CITY_SUGGESTIONS_BY_STATE[stateCode] || CITY_SUGGESTIONS_DEFAULT;

  return (
    <div>
      {isRemote ? (
        <div className="flex items-center justify-between rounded-lg border border-line bg-ink-soft px-3 py-2.5 text-sm text-bone-dim">
          Remote / Online — no fixed city
          <button
            type="button"
            onClick={toggleRemote}
            className="font-medium text-gold hover:underline"
          >
            Set a city instead
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-bone-dim">
              {cityLabel}
            </label>
            <input
              list={listId}
              value={city}
              onChange={handleCityChange}
              placeholder="e.g. Atlanta"
              autoComplete="off"
              className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
            />
            <datalist id={listId}>
              {suggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-bone-dim">
              {stateLabel}
            </label>
            <select
              value={stateCode}
              onChange={handleStateChange}
              className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone outline-none focus:border-gold"
            >
              <option value="">--</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {!isRemote && (
        <button
          type="button"
          onClick={toggleRemote}
          className="mt-1.5 text-xs font-medium text-bone-dim hover:text-gold"
        >
          I'm remote / online instead
        </button>
      )}
    </div>
  );
}
