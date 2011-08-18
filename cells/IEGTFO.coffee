define ->
  render: (R)-> [
    R '.pls',
      "Please use another browser."
      R '.ftlog.ftlog2',
        'chrome, firefox, safari, mobile safari, opera, or '
        R 'span', "any browser that doesn't suck",
        '.'
    R 'div', '☑ Saddam Hussein'
    R 'div', '☑ Osama Bin Laden'
    R 'div.ie', '☐ ', R 'span', 'Internet Explorer'
  ]

