import { ReactNode, useState } from 'react';

import { FiPlus } from "react-icons/fi";
import { Autocomplete, createFilterOptions, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import Dialog from '@/components/Dialog';

import { ICreatableSelectOption } from '@/types/util.type';

const filter = createFilterOptions<any>();

type Props = {
  value: any;
  label?: string;
  options: ICreatableSelectOption[];
  onChange: (value: ICreatableSelectOption) => void;
  formId: string;
  dialogTitle: string;
  placeholder?: string;
  renderForm: (formId: string, value: any, toggle: () => void) => ReactNode;
  isCreateOnInputChange?: boolean;
};

const CreatableAutoCompleteInput = ({
  value,
  label,
  onChange,
  formId,
  renderForm,
  dialogTitle,
  placeholder,
  isCreateOnInputChange = true,
  options = [],
}: Props) => {
  const { t } = useTranslation();

  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const toggleDialog = () => setOpenFormDialog((prev: boolean): boolean => !prev);

  return (
    <>
      <Stack direction="row" spacing={1.6}>
        <Autocomplete
          sx={{ flex: 1 }}
          value={value}
          onChange={(_, newValue) => {
            if (typeof newValue === 'string' && isCreateOnInputChange) {
              // timeout to avoid instant validation of the dialog's form.
              setTimeout(() => {
                toggleDialog();
                onChange({
                  label: newValue,
                  value: uuidv4(),
                });
              });
              return;
            }
            if (newValue?.inputValue && isCreateOnInputChange) {
              toggleDialog();
              onChange({
                label: newValue.inputValue,
                value: uuidv4(),
              });
              return;
            }

            onChange(newValue);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            // new value not in the option list
            if (params.inputValue !== '') {
              if (isCreateOnInputChange) {
                filtered.push({
                  inputValue: params.inputValue,
                  label: `${t('add')} "${params.inputValue}"`,
                });
              } else {
                filtered.push({
                  label: t('noFound', { value: params.inputValue }),
                  disabled: true,
                });
              }
            }

            return filtered;
          }}
          id="creatable-autocomplete"
          options={options}
          getOptionLabel={option => {
            // e.g value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.label;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, option) => {
            return (
              <li {...props}>
                {option.label}
              </li>
            );
          }}
          freeSolo
          renderInput={params => <TextField {...params} placeholder={placeholder} label={label} />}
        />
        {!isCreateOnInputChange && (
          <Tooltip title={dialogTitle}>
            <IconButton
              onClick={toggleDialog}
              sx={{
                border: '1px solid ' + grey[400],
                borderRadius: 1,
                px: 2,
              }}>
              <FiPlus />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Dialog
        maxWidth="sm"
        fullWidth
        title={dialogTitle}
        open={openFormDialog}
        toggle={toggleDialog}
        // initialize the value when the dialog is open
        formId={formId}>
        {renderForm(formId, openFormDialog && !isCreateOnInputChange ? null : value, toggleDialog)}
      </Dialog>
    </>
  );
};

export default CreatableAutoCompleteInput;
