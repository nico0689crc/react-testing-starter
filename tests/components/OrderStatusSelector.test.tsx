import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Theme } from '@radix-ui/themes';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';

describe('OrderStatusSelector', () => {
  const onChange = vi.fn();

  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      trigger: screen.getByRole('combobox'),
      user: userEvent.setup(),
      getOptions: () => screen.findAllByRole("option"), //Lazy evaluation: Postpone this evaluation to the future when it is needed.
      getOption: (regExp: RegExp) => screen.findByRole('option', { name: regExp }),
      onChange,
    }
  }

  it('should render New as the default value', () => {
    const { trigger } =renderComponent(); 
    expect(trigger).toHaveTextContent(/new/i);
  });

  it('should render the correct status', async () => {
    const { trigger, user, getOptions } = renderComponent();

    await user.click(trigger);

    const options = await getOptions();
    expect(options).toHaveLength(3);

    const labels = options.map(option => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });


  it.each([
    { label: /processed/i, value: 'processed' },
    { label: /fulfilled/i, value: 'fulfilled' }
  ])('should call OnChange with the value of "$value" when click option', async ({label, value}) => {
    const { trigger, user, onChange, getOption } = renderComponent();

    await user.click(trigger);

    const option = await getOption(label);

    await user.click(option);

    expect(onChange).toHaveBeenCalledWith(value);
  });

  it('should call OnChange with a value New afte select a different option first', async () => {
    const { trigger, user, onChange, getOption } = renderComponent();

    await user.click(trigger);
    const optionProcessed = await getOption(/processed/i);
    await user.click(optionProcessed);

    await user.click(trigger);
    const optionNew = await getOption(/new/i);
    await user.click(optionNew);

    expect(onChange).toHaveBeenCalledWith('new');
  })
})