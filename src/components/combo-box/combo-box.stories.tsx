import React from 'react';
import { useState } from 'react';
import { ComboBox } from './combo-box';

export default {
  title: 'ComboBox'
};

export function Default() {
  const [value, setValue] = useState<string>('');

  return (
    <ComboBox
      value={value}
      onChange={(val: string): void => setValue(val)}
      options={{
        css: { label: 'CSS', id: 'css' },
        html: { label: 'HTML', id: 'html' },
        react: { label: 'React', id: 'react' },
        mobx: { label: 'Mobx', id: 'mobx' },
        redux: { label: 'Redux', id: 'redux' },
        js: { label: 'JS', id: 'js' },
        typescript: {
          label: 'Typescript',
          id: 'typescript'
        },
        mui: { label: 'MUI', id: 'mui' }
      }}
      defaultValue="html"
      placeholder="Frontend"
      disabled={false}
      required={false}
    />
  );
}
