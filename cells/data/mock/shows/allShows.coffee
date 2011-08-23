define ->
  _ = (o)->o

  shows = [
    'Mad Men'
    'Falling Skies'
    'Game of Thrones'
    'Sherlock'
    'Heroes'
    '24'
    'Awakening'
    'Breaking Bad'
    'Wilfred'
    'The Wire'
    'The Big Bang Theory'
    'Lost'
    'Camelot'
    'The Borgias'
    'The Walking Dead'
    'Vampire Diaries'
    'MI6'
    'Boardwalk Empire'
    'FRONTLINE'
    'American Experience'
    'Modern Marvels'
    'Mythbusters'
  ]

  actors = [
    _ id: 0, name: 'Jon Hamm'
    _ id: 1, name: 'Noah Wiley'
    _ id: 2, name: 'Elisabeth Moss'
    _ id: 3, name: 'Vincent Kartheiser'
    _ id: 4, name: 'January Jones'
    _ id: 5, name: 'Christina Hendricks'
    _ id: 6, name: 'Aaron Staton'
    _ id: 7, name: 'Rich Sommer'
    _ id: 8, name: 'John Slattery'
  ]

  result = {}
  for show,i in shows
    result[i] =
      id: i
      title: show
      description:
        """
        [#{i}] #{show} - Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        """
      cast: actors
  result