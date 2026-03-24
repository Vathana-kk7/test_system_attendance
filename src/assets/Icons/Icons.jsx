import React from 'react';
import CountingNumber from '../../components/CountingNumber';

// demo helper showing how `CountingNumber` could be used with various props
export const CountingFromNumberDemo = ({
  number,
  fromNumber,
  padStart,
  decimalSeparator,
  decimalPlaces,
  delay,
}) => {
  return (
    <CountingNumber
      key={delay}
      number={number}
      className="text-4xl font-semibold"
    />
  );
};

function Icons() {
  return (
    <div>
      {/* Example usage */}
      <CountingFromNumberDemo
        number={100}
        fromNumber={0}
        padStart={false}
        decimalSeparator="."
        decimalPlaces={0}
        delay={0}
      />
    </div>
  );
}

export default Icons;