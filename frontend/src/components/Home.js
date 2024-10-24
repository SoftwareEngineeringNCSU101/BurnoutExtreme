import UserCaloriesPage from './UserCaloriesPage';

function Home(props) {
  return (
    <div className="Home">
        <UserCaloriesPage {...props}/>
    </div>
  );
}

export default Home;