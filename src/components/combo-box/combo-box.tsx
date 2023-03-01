import React, { useEffect, useRef, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from 'styled-components';

type OptionsItem = { label: string; id: string };
type Options = { [key: string]: OptionsItem };

type ComboBoxProps = {
  value: string;
  onChange: (val: string) => void;
  options: Options;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

export function ComboBox({
  value,
  onChange,
  options,
  defaultValue,
  placeholder,
  disabled,
  required
}: ComboBoxProps): JSX.Element {
  const wrapperRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [matched, setMatched] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('');
  const [currentOptions, setCurrentOptions] = useState<Options>({});

  const getLastValue = (): void => {
    setCurrentValue(value ? options[value].label : '');
    setMatched(value);
  };

  const getCurrentOptions = (): void => {
    if (!required) {
      setCurrentOptions({ '': { label: '', id: '' }, ...options });
    } else setCurrentOptions(options);
  };

  const getAreSame = (val: string, val2: string): boolean => {
    return val.toLowerCase() === val2.toLowerCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
        getLastValue();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, currentValue, value, isOpen]);

  useEffect((): void => {
    getCurrentOptions();
    if (defaultValue) {
      onChange(defaultValue);
      setCurrentValue(options[defaultValue].label);
      setMatched(defaultValue);
    } else {
      value && getLastValue();
    }
  }, []);

  const changeCurrentOptions = (val: string): void => {
    setIsOpen(true);
    setCurrentValue(val);
    setMatched('');

    if (val) {
      const founded: Options = {};

      Object.values(options).forEach((item: OptionsItem): void => {
        if (item.label.toLowerCase().includes(val.toLowerCase())) {
          founded[item.id] = item;
        }
        if (getAreSame(item.label, val)) setMatched(item.id);
      });

      if (Object.values(founded).length) {
        setCurrentOptions(founded);
      } else {
        setCurrentOptions({ null: { label: 'No options', id: 'null' } });
      }
    } else {
      getCurrentOptions();
    }
  };

  return (
    <Wrapper ref={wrapperRef}>
      <InputWrapper>
        <input
          type="text"
          placeholder={placeholder}
          value={currentValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            changeCurrentOptions(event.target.value);
          }}
          disabled={disabled}
          onClick={(): void => {
            !disabled && setIsOpen(true);
            getCurrentOptions();
          }}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>): void => {
            if (event.key === 'Enter') {
              if (currentOptions[matched]) {
                onChange(matched);
                setCurrentValue(currentOptions[matched].label);
                (event.target as HTMLInputElement).blur();
                setIsOpen(false);
              }
            }
          }}
        />
        <Arrow
          isOpen={isOpen}
          onClick={(): void => {
            !disabled && setIsOpen(!isOpen);
          }}
        >
          <ArrowDropDownIcon />
        </Arrow>
      </InputWrapper>
      {isOpen && (
        <Menu>
          {Object.values(currentOptions).map(
            (item: OptionsItem, index: number): JSX.Element => {
              return (
                <MenuButton
                  key={item.id}
                  selected={
                    getAreSame(currentValue, item.label) ||
                    (!!required && index === 0 && !value)
                  }
                  onClick={(): void => {
                    if (item.id !== 'null') {
                      onChange(item.id);
                      setCurrentValue(item.label);
                      setIsOpen(false);
                      getCurrentOptions();
                    }
                  }}
                >
                  <p>{item.label}</p>
                </MenuButton>
              );
            }
          )}
        </Menu>
      )}
    </Wrapper>
  );
}

type ArrowProps = {
  readonly isOpen: boolean;
};

type MenuLiProps = {
  readonly selected: boolean;
};

const Wrapper = styled.section`
  max-width: 250px;
`;

const InputWrapper = styled.section`
  position: relative;

  & > input {
    height: 30px;
    width: calc(100% - 40px);
    border: 2px solid rgba(181, 66, 19, 1);
    border-radius: 8px;
    padding: 5px 30px 5px 10px;
  }

  & > button {
    position: absolute;
    z-index: 1;
    right: 3%;
    top: 25%;
    height: min-content;
    border-radius: 50%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;

    & > svg {
      transition: all 0.4s ease-in-out;
      border-radius: 50%;
    }

    &:hover {
      & > svg {
        filter: brightness(0) saturate(100%) invert(26%) sepia(60%)
          saturate(2037%) hue-rotate(355deg) brightness(97%) contrast(91%);
      }
    }

    &:active {
      & > svg {
        background-color: rgba(181, 66, 19, 1);
        filter: none;
      }
    }
  }
`;

const Arrow = styled.button<ArrowProps>`
  > svg {
    transform: ${(props: ArrowProps) => (props.isOpen ? 'rotate(180deg)' : '')};
  }
`;

const Menu = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 100px;
  margin: 0;
  margin-top: 1px;
  padding: 5px 0 5px 5px;
  margin-right: -5px;
  overflow-y: auto;
  border: 2px solid rgba(181, 66, 19, 0.8);
  border-radius: 8px;

  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(181, 66, 19, 1);

    :hover {
      -webkit-transition-duration: 0.4s;
      transition-duration: 0.4s;
      box-shadow: inset 4px -4px 4px rgba(255, 255, 255, 0.5),
        inset -4px 4px 4px rgba(255, 255, 255, 0.5);
    }
  }
`;

const MenuButton = styled.button<MenuLiProps>`
  border-radius: 8px;
  border: 0;
  padding: 2px 6px;
  margin-right: 5px;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
  background-color: ${(props: MenuLiProps) =>
    props.selected ? ' rgba(181, 66, 19, 1)' : 'transparent'};

  &:hover {
    background-color: ${(props: MenuLiProps) =>
      props.selected ? ' rgba(181, 66, 19, 1)' : 'rgba(181, 66, 19, 0.6)'};
  }

  & > p {
    margin: 0;
    color: ${(props: MenuLiProps) => (props.selected ? ' white' : 'black')};
    word-break: break-all;
    min-height: 14px;
    text-align: start;
  }
`;
