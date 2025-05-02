export default {
  parserPreset: {
    parserOpts: {
      headerPattern: /^\[(.+?)\]\s(\w+):\s(.+)$/,
      headerCorrespondence: ['jira', 'type', 'subject'],
    },
  },
  plugins: [
    {
      rules: {
        'title-pattern': ({ jira, type, subject }) =>
          jira === null || type === null || subject === null
            ? [
                false,
                'Commit message pattern should be in the form of [JIRA ID] feat|fix|refactor|chore|test|style: message \n for example: [FTA-123] feat: add user profile',
              ]
            : [true, ''],
      },
    },
  ],
  rules: {
    'title-pattern': [2, 'always'],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'chore', 'test', 'style'],
    ],
    'header-max-length': [2, 'always', 100],
    'subject-empty': [2, 'never'],
  },
}
