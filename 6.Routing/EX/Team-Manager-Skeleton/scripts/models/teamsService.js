let teamsService = (() => {
    function loadTeams() {
        // Request teams from db
        return requestService.get('appdata', 'teams', 'kinvey');
    }

    function loadTeamDetails(teamId) {
        return requestService.get('appdata', 'teams/' + teamId, 'kinvey');
    }

    function edit(teamId, name, description) {
        let teamData = {
            name: name,
            comment: description,
            author: sessionStorage.getItem('username')
        };

        return requestService.update('appdata', 'teams/' + teamId, 'kinvey', teamData);
    }

    function createTeam(name, comment) {
        let teamData = {
            name: name,
            comment: comment
        };

        return requestService.post('appdata', 'teams', 'kinvey', teamData);
    }


    function joinTeam(teamId) {
        let userData = {
            username: sessionStorage.getItem('username'),
            teamId: teamId
        };

        return requestService.update('user', sessionStorage.getItem('userId'), 'kinvey', userData);
    }

    function leaveTeam() {
        let userData = {
            username: sessionStorage.getItem('username'),
            teamId: ''
        };

       return requestService.update('user', sessionStorage.getItem('userId'), userData, 'kinvey');
    }


    return {
        loadTeams,
        loadTeamDetails,
        edit,
        createTeam,
        joinTeam,
        leaveTeam
    }
})()