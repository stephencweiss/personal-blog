const dayjs = require(`dayjs`)

const ENTRIES_PER_PAGE = 5
const BUILD_TIME = dayjs()
const FAKE_START = dayjs('1900-01-01')
const TODAY = dayjs()
  .format('YYYY-MM-DD')
  .toString()

module.exports = { BUILD_TIME, ENTRIES_PER_PAGE, FAKE_START, TODAY }
