const findTickets = require('../find-tickets');

test('matches', () => {
  const commits = [
    {
      message: '',
    },
    {
      message: 'dfgfd Resolves BLMP-11 Closes BLMP-22 Some Message',
    },
    {
      message: 'dfgfd Resolves BLMP-123 dfgfd',
    },
    {
      message: '    CLOSES BLMP-234',
    },
    {
      message: 'invalid',
    },
    {
      message: 'fIXES BLMP-456     ',
    },
    {
      // Duplicate
      message: 'fIXES BLMP-456',
    },
    {
      message: 'fix: Resolves BLMP-143 Testing release',
    },
  ];

  expect(findTickets(commits)).toMatchObject([
    'BLMP-11',
    'BLMP-123',
    'BLMP-143',
    'BLMP-22',
    'BLMP-234',
    'BLMP-456',
  ]);
});
