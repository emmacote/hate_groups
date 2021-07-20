
$(function(w){

    const success = function(statesHash){

        // state by state data display
        let stateByStateTable = $("#statebystatetable");

        let state;
        let rowObject;
        for(state in statesHash){
            let squareMiles = statesHash[state].square_miles;
            let hateCount = statesHash[state].hate_count;
            let mostCommon = statesHash[state].most_common;
            let population = statesHash[state]["pop"];
            let hateSquareMile = hateCount / squareMiles;
            let hatePerson = hateCount / population;

            let popCell = $("<td>").text(Number(population).toLocaleString());
            let stateCell = $("<td>").text(state);
            let squareMilesCell = $("<td>").text(squareMiles.toLocaleString());
            let hateCountCell = $("<td>").text(hateCount.toLocaleString());
            let mostCommonCell = $("<td>").text(mostCommon);
            let hateSquareMileCell = $("<td>").text(hateSquareMile);
            let hatePersonCell = $("<td>").text(hatePerson);


            let newRow = $("<tr>");
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
        let totalMiles = 0;
        let totalHateCount = 0;
        let totalPopulation = 0;
        for(state in statesHash){
            let squareMiles = statesHash[state].square_miles;
            let hateCount = statesHash[state].hate_count;
            let mostCommon = statesHash[state].most_common;
            let population = statesHash[state]["pop"];

            totalMiles = totalMiles + squareMiles;
            totalHateCount = totalHateCount + hateCount;
            totalPopulation = totalPopulation + Number(population);

        }

        $("#nw_population").text(totalPopulation.toLocaleString());
        $("#nw_square_miles").text(totalMiles.toLocaleString());
        $("#nw_num_groups").text(totalHateCount.toLocaleString());

        let hatePerSquareMile = totalHateCount / totalMiles;
        let hatePerPerson = totalHateCount / totalPopulation;
        $("#nw_groups_square_mile").text(hatePerSquareMile);
        $("#nw_groups_person").text(hatePerPerson);

    };

    const error = function(e){
        console.log("error in ajax request...");
        console.log(e);
    };

    const url = "/hatedata";
    const hateDataPromise = $.ajax(url);
    hateDataPromise.then(success, error);

    const nationwidePromise = $.ajax("/mostcommonhatenationwide");
    nationwidePromise.then(function(res){
        $("#nw_most_common_group").text(res);
    });

}(window));