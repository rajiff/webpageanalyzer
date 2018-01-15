let config = {
  WWW_PORT: (process.env.PORT || 8080),
  METADATA_URL: (process.env.METADATA_URL || 'http://localhost:8000'),
  LINKS_URL: (process.env.LINKS_URL || 'http://localhost:8010'),
  HEADINGS_URL: (process.env.HEADINGS_URL || 'http://localhost:8020')
}

module.exports = config;