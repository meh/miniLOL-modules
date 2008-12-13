if (! this.sh_languages) {
  this.sh_languages = {};
}
sh_languages['changelog'] = [
  [
    [
      /[\d]{2,4}-?[\d]{2}-?[\d]{2}/g,
      'sh_date',
      1,
      1
    ],
    [
      /(^[ \t]+)(\*)([ \t]+)((?:[^:]+\:)?)/g,
      ['sh_normal', 'sh_symbol', 'sh_normal', 'sh_file'],
      -1
    ],
    [
      /(^[ \t]+)((?:[^:]+\:)?)/g,
      ['sh_normal', 'sh_file'],
      -1
    ]
  ],
  [
    [
      /$/g,
      null,
      -2
    ],
    [
      /(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,
      'sh_url',
      -1
    ],
    [
      /(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,
      'sh_url',
      -1
    ],
    [
      /(?:[A-Za-z0-9_]|[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-])+/g,
      'sh_name',
      -1
    ]
  ]
];
