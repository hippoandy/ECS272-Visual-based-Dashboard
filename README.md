# ECS272-Visual-based-Dashboard
This is the course project for the course ECS272 Information Visualization at UC Davis.

## Introduction

The objective of this project is for the student to have hand-on experiences with D3.js library and basic skills for data visualization.
The datasets are provided by the professor and the student are allowed to choose one of the given datasets.
For this project, I chose to use the Pokemon dataset. Additionally, I found another dataset available on the Kaggle platform, which is the image datasets of Pokemon data.

The link to the datasets:
* [Pokémon for Data Mining and Machine Learning](https://www.kaggle.com/alopez247/pokemon)
* [Pokemon Images](https://www.kaggle.com/dollarakshay/pokemon-images)

This project is required to have the followings be completed:
1. to use at least 3 visualization techniques showing the data
2. each visualization should have at least 2 levels of granularity

I decide to make my system as a "game-like" system, which means I tried to make the interface like a gaming interface.
This system has three pages, which is seperated using tab and they are able to be switch using the navbar on the top of the page.

The functionalities of this system are:
### The First Page:
1. choose one of a Pokemon on the list to view the detail data
2. click on the radar chart to see how good is the selected Pokemon among others (using bar chart)
3. click on the bar in the bar chart will list the Pokemons belongs to each group
### The Second Page:
1. the Pokemons are divded into several groups based on the type (type is defined in the dataset)
2. a bubble chart is available to see how many groups are and how big is a certain group
3. click on the bubble will list all the Pokemons in the same type
### The Third Page:
This page shows the basic statistics result suggested by the Pokemon dataset. Using the scatter chart here enables the user to observe the relationship among different ability of the Pokemon.

## Screenshots
### The First Page
![Page 1](https://github.com/hippoandy/ECS272-Visual-based-Dashboard/blob/master/screenshots/cover1.png?raw=true)
### The Second Page
![Page 2](https://github.com/hippoandy/ECS272-Visual-based-Dashboard/blob/master/screenshots/cover2.png?raw=true)
### The Third Page
![Page 3](https://github.com/hippoandy/ECS272-Visual-based-Dashboard/blob/master/screenshots/cover3.png?raw=true)
