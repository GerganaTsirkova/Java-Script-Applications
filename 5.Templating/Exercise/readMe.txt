Exercises: Templating
Problems for exercises and homework for the “JavaScript Applications” course @ SoftUni.
The following tasks have no automated test – submit your solutions for peer review on the course page.
⦁	List Towns
You are a given an input field with a button. In the input field you should enter elements separated by comma and whitespace (", "). Your task is to create a simple template that defines a list of towns. Each town comes from the input field.
listtown.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>List Town</title>
    <script src="node_modules/handlebars/dist/handlebars.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="towns.js"></script>
</head>
<body>
<input id="towns" type="text"/>
<button id="btnLoadTowns">Load</button>
<div id="root"></div>
</body>
<script>
    $(() => attachEvents())
</script>
<script type="text/x-handlebars-template" id="towns-template">
    // TODO: Create the template here
</script>
</html>

In your attachEvents() function you should attach a click event to the button with id “btnLoadTowns” and render the towns that come from the input field in the html template with id “towns-template”
  Screenshots 
This is how the html look like:
 
⦁	HTTP Status Cats
Download project skeleton. 
We all love cats. They are also a fun way to learn all the HTTP status codes.
Your task is to refactor the given html and to create a template to represent each cat card block on it’s own. After you have created the templete render it into the div with id “allCats”.
A cat has an id, statusCode, statusMessage and imageLocation. The cats are seeded using the function from the js file named catSeeder.js
Each card block has a button that unveils status code information connected to each cat. You should toggle the button and change it’s text from “Show status code” to “Hide status code”.
Screenshots 
  
