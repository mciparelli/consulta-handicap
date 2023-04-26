import { forwardRef, Fragment, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useMediaQuery } from "react-responsive";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Form, useSearchParams, useSubmit } from "@remix-run/react";

export default forwardRef(function Chart({ data, months }, ref) {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const notMobile = useMediaQuery({ query: "(min-width: 640px)" });
  const handicaps = data.map((v) => v.y);
  const monthsBack = Number(searchParams.get("months")) || months[0];
  let ticksEveryNDays = notMobile ? 7 : 14;
  if (monthsBack === 6) {
    ticksEveryNDays = notMobile ? 14 : 28;
  }
  return (
    <Fragment>
      <div className="mt-4 mb-2 w-48">
        <Listbox defaultValue={monthsBack} name="months">
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">
                {monthsBack === 1
                  ? "Último mes"
                  : `Últimos ${monthsBack} meses`}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => submit(ref.current.closest("form"))}
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {months.map((month) => (
                  <Listbox.Option
                    key={month}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`}
                    value={month}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {month === 1
                            ? "Último mes"
                            : `Últimos ${month} meses`}
                        </span>
                        {selected
                          ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )
                          : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      <div className="my-3 h-80 bg-white rounded-sm" ref={ref}>
        <ResponsiveLine
          data={[{ id: "historico", data }]}
          margin={{ top: 30, right: 50, bottom: 50, left: 80 }}
          xScale={{
            type: "time",
            format: "%Q",
          }}
          xFormat="time:%Q"
          yScale={{
            type: "linear",
            min: handicaps.reduce((acc, v) => Math.min(acc, v)) - 0.2,
            max: handicaps.reduce((acc, v) => Math.max(acc, v)) + 0.2,
          }}
          theme={{
            axis: { legend: { text: { fontSize: 16, fontWeight: 600 } } },
          }}
          axisLeft={{
            legend: "Hándicap",
            legendOffset: -58,
            legendPosition: "middle",
            tickSize: 5,
            tickPadding: 12,
            tickValues: 5,
            format: ">-.1f",
          }}
          colors={{ scheme: "category10" }}
          axisBottom={{
            format: (time) => {
              // adding 3 hours just because times are set at midnight in utc-3
              time.setHours(time.getHours() + 3);
              const date = time.getDate();
              const month = time.getMonth() + 1;
              return `${String(date).padStart(2, "0")}-${
                String(month).padStart(2, "0")
              }`;
            },
            tickValues: `every ${ticksEveryNDays} days`,
            tickPadding: 12,
          }}
          layers={["grid", "axes", "points", "lines"]}
          pointSize={16}
          pointLabelYOffset={-15}
          enablePointLabel={true}
          enableGridX={false}
        />
      </div>
    </Fragment>
  );
});
