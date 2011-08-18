define [
  'Bus'
  'data/UserService'
  'data/ShowService'
], (Bus,UserService,ShowService)->

  isIOS: (ua = navigator.userAgent).match(/iPhone/i) or ua.match(/iPod/i) or ua.match(/iPad/i)
  user: UserService
  show: ShowService