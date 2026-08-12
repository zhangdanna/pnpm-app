import { Button } from '@my-org/ui';
import { formatDate, formatPrice } from '@my-org/utils';

const APP = () => {
  return (
    <div>
      <h1>Monorepo Demo - {formatDate(new Date())}</h1>
      <Button
        label="test"
        price={9.0}
        onClick={() => {
          console.log(formatPrice(9.0));
        }}
      ></Button>
    </div>
  );
};

export default APP;
