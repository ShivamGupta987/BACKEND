
import app from './app.js'
import connectionToDB from './src/config/dbConnection.js'
const PORT = process.env.PORT || 5000

// Start the server
app.listen(PORT, async() => {
    await connectionToDB()
    console.log(`Server is running on port ${PORT}`)
})
