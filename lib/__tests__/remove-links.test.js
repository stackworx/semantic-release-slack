const removeLinks = require('../remove-links');

const notes =
  '## [1.0.5](https://gitlab.com/stackworx.io/merchant-portal/compare/v1.0.4...v1.0.5) (2018-08-08)\n\n\n### Bug Fixes\n\n* Resolves BLMP-143 Testing release ([d1a3a89](https://gitlab.com/stackworx.io/merchant-portal/commit/d1a3a89))\n\n\n\n';

test('removeLinks', () => {
  expect(removeLinks(notes)).toMatchSnapshot();
});
