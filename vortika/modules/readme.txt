Each of these subfolders must match a collection 
in the database. 

When defining controllers, the convention used here
is that if a controller is using a given collection,
then that controller should be listed in the respective
collection folder. (Example: ThemesController uses the pages collection.);

If not collection exists and the controller uses too many services to
be associated with, then put it in pages/. (Example: DashboardController). 
Don't create new *.view.js files for these orphan controllers. Use the 
<collection>.view.js file.

Each collection folder must have an associated tests/ folder.