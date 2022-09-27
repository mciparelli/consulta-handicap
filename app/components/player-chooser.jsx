import { Fragment } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Combobox, Transition } from '@headlessui/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Form, useFetcher, useLoaderData, useNavigate } from '@remix-run/react';

export default function PlayerChooser() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { data: players } = fetcher;
  const loading = fetcher.state === 'submitting';

  const onChange = useDebouncedCallback((ev) => {
    fetcher.submit(ev.target.form);
  }, 250);

  return (
    <Combobox
      as='div'
      className='relative w-full md:w-auto'
      onChange={(player) =>
        window.location.href = `/tarjetas/${player.matricula}`}
    >
      <fetcher.Form
        method='get'
        action='/find-players'
        className='flex justify-between'
      >
        <Combobox.Input
          name='searchString'
          placeholder='Matrícula o apellido'
          className='p-3 rounded-md w-full md:w-80'
          autoComplete='off'
          onChange={onChange}
        />
        {loading && (
          <ArrowPathIcon className='absolute right-2 top-0 bottom-0 my-auto w-5 animate-spin' />
        )}
      </fetcher.Form>
      <Transition
        as={Fragment}
        enter='transition duration-150 ease-in'
        enterFrom='transform origin-top scale-y-75 opacity-0'
        enterTo='transform origin-top scale-y-100 opacity-100'
        leave='transition duration-150 ease-out'
        leaveFrom='transform origin-top scale-y-100 opacity-100'
        leaveTo='transform origin-top scale-y-75 opacity-0'
      >
        <Combobox.Options
          className={`z-10 absolute bg-white max-h-60 mt-1 overflow-auto rounded-md shadow-lg w-full ${
            loading && 'opacity-60'
          }`}
        >
          {players?.map((player) => (
            <Combobox.Option
              key={player.matricula + player.fullName}
              className={({ active }) =>
                `cursor-pointer capitalize block truncate py-2 px-4 ${
                  active ? 'bg-blue-700 text-white' : undefined
                }`}
              value={player}
            >
              {player.fullName} ({player.handicapIndex})
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
