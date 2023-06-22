import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { TSelectFieldItems } from "../types";

const EMPTY_SELECT_ITEM = {
  id: "",
  name: "",
};

export default function SelectField({
  label = "Select",
  placeholder = "Select an option",
  items = [],
  value,
  onChange,
}: {
  label?: string;
  placeholder?: string;
  items: TSelectFieldItems[];
  value: TSelectFieldItems | null;
  onChange: (item: TSelectFieldItems | null) => void;
}) {
  const [selected, setSelected] = useState<TSelectFieldItems>(
    value ?? EMPTY_SELECT_ITEM
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSelected(value ?? EMPTY_SELECT_ITEM);
  }, [value]);

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox
      value={selected}
      onChange={(v) => {
        setSelected(v ?? EMPTY_SELECT_ITEM);
        onChange(v);
      }}
      by={(a: TSelectFieldItems, b: TSelectFieldItems) => {
        return a?.id === b?.id;
      }}
    >
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden text-left">
          <Combobox.Label className="text-xs">{label}</Combobox.Label>
          <div className="relative">
            <Combobox.Input
              className="w-full border py-2 pl-3 pr-10 h-[42px] focus:ring-0"
              displayValue={(item: TSelectFieldItems | null) =>
                item ? item.name : ""
              }
              placeholder={placeholder}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredItems.map((item) => (
                <Combobox.Option
                  key={item.id}
                  disabled={item.disabled}
                  className={({ active }) =>
                    clsx(
                      `relative cursor-default select-none py-2 pl-10 pr-16 ${
                        active
                          ? "bg-ig-base-primary text-white"
                          : "text-gray-900"
                      }`,
                      item.disabled ? "bg-slate-200 text-lg opacity-50" : ""
                    )
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                      {item.extra && typeof item.extra === "string" ? (
                        <span className="absolute inset-y-0 right-0 flex items-center mr-2 text-xs italic">
                          {item.extra}
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
