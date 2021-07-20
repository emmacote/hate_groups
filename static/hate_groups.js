
$(function(w){

    var success = function(statesHash){

        // state by state data display
        var stateByStateTable = $("#statebystatetable");

        var state;
        var rowObject;
        for(state in statesHash){
            var squareMiles = statesHash[state].square_miles;
            var hateCount = statesHash[state].hate_count;
            var mostCommon = statesHash[state].most_common;
            var population = statesHash[state]["pop"];
            var hateSquareMile = hateCount / squareMiles;
            var hatePerson = hateCount / population;

            var popCell = $("<td>").text(Number(population).toLocaleString());
            var stateCell = $("<td>").text(state);
            var squareMilesCell = $("<td>").text(squareMiles.toLocaleString());
            var hateCountCell = $("<td>").text(hateCount.toLocaleString());
            var mostCommonCell = $("<td>").text(mostCommon);
            var hateSquareMileCell = $("<td>").text(hateSquareMile);
            var hatePersonCell = $("<td>").text(hatePerson);


            var newRow = $("<tr>");
            stateCell.appendTo(newRow);
            popCell.appendTo(newRow);
            squareMilesCell.appendTo(newRow);
            hateCountCell.appendTo(newRow);
            mostCommonCell.appendTo(newRow);
            hateSquareMileCell.appendTo(newRow);
            hatePersonCell.appendTo(newRow);

            newRow.appendTo(stateByStateTable);
        }

        // nationwide data display
        var totalMiles = 0;
        var totalHateCount = 0;
        var totalPopulation = 0;
        for(state in statesHash){
            var squareMiles = statesHash[state].square_miles;
            var hateCount = statesHash[state].hate_count;
            var mostCommon = statesHash[state].most_common;
            var population = statesHash[state]["pop"];

            totalMiles = totalMiles + squareMiles;
            totalHateCount = totalHateCount + hateCount;
            totalPopulation = totalPopulation + Number(population);

        }

        $("#nw_population").text(totalPopulation.toLocaleString());
        $("#nw_square_miles").text(totalMiles.toLocaleString());
        $("#nw_num_groups").text(totalHateCount.toLocaleString());

        var hatePerSquareMile = totalHateCount / totalMiles;
        var hatePerPerson = totalHateCount / totalPopulation;
        $("#nw_groups_square_mile").text(hatePerSquareMile);
        $("#nw_groups_person").text(hatePerPerson);

    };

    var error = function(e){
        console.log("error in ajax request...");
        console.log(e);
    };

    var url = "/hatedata";
    var promise = $.ajax(url);
    promise.then(success, error);

    var promise = $.ajax("/mostcommonhatenationwide");
    promise.then(function(res){
        $("#nw_most_common_group").text(res);
    });

}(window));