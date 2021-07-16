###What this is...

"Hate Group" is a project that displays a sunmming up of general hate group tendencies both at a state-by-state and U.S.
national level. It was created by the author as a way to shake off the rust when it comes to web application basics.
<br />

####How I Run It:
1. Clone the project into a local directory.
2. Set it up as a project in my IDE. (in my case, Pycharm)
3. Set up the environment to support BeautifulSoup, requests, and Flask.
4. In migrate_data.py, change __main__ section to call the create_database function.
5. Once done, change the same file again but now to call the "populate_db" function and populate the database.
6. To set it up to run in browser, use your IDE (such as Pycharm) to run the "hate_data.py" file. 
7. Open up a web browser to http://localhost:5000/. Click either "nationwide" or "State by State" to see the data.


####TODO:
1. Set up to default to showing natiuonwide data by default.