const Decimal = require('decimal.js');

function compute(precision) {
  let dpi = Decimal.set({ precision: 100 })("640_320")
    .pow(3)
    .div(Decimal("1_728" /* = 24 * 6 * 2 * 6 */))
    .log();

  Decimal.precision = "3.".length + (precision = +precision || 1);

  function chudnovsky(n, C) {
    // C = 426880 * 10005^0.5
    C = Decimal("426_880").times(Decimal("10_005").sqrt());

    Object.assign(C, {
      "545_140_134": Decimal("545_140_134"),
      "-262_537_412_640_768_000": Decimal("-262_537_412_640_768_000")
    });

    // See https://www.sitepoint.com/javascript-functions-that-define-and-rewrite-themselves/
    chudnovsky = function (n, pi, q, Mq, Lq, Xq, Kq) {
      for (
        q = 0,
          pi = Decimal(0),
          Kq = Decimal(-6),
          Lq = Decimal("13_591_409"),
          Mq = Xq = Decimal(1);
        q++ < n;

      ) {
        /*!
         * Multinomial term: Mq = (6q)! / ((3q)! * (q)!^3)
         * Linear term: Lq = 545140134q + 13591409
         * Exponential term: Xq = -262537412640768000^q
         * Pi series partial summation:
         */
        pi = pi.plus(Mq.times(Lq).div(Xq));
        Kq = Kq.plus(12);
        Mq = Mq.times(Kq.pow(3).minus(Kq.times(16)).div(Decimal(q).pow(3)));
        Lq = Lq.plus(C["545_140_134"]);
        Xq = Xq.times(C["-262_537_412_640_768_000"]);
      }

      // π = C / pi
      return C.div(pi).valueOf();
    };

    return chudnovsky(n);
  }

  let result = [];

  for (let n of Array.from(
    { length: Math.max(Math.ceil(precision / +dpi), 1) },
    (_, i) => ++i
  )) {
    result[n - 1] = chudnovsky(n);
  }

  return result;
}
