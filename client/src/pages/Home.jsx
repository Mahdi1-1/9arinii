function Home({ message }) {
  return (
    <div>
      <h1>Accueil</h1>
      <p>Bienvenue sur notre application MERN Stack!</p>
      {message && <p>Message du serveur: {message}</p>}
    </div>
  )
}

export default Home
