"use strict";

const 	socket = io.connect();

let	teamID = window.localStorage.getItem('teamID'),
	teamTitle = window.localStorage.getItem('teamTitle'),
	formerRank = window.localStorage.getItem('formerRank'),
	formerTitle = window.localStorage.getItem('formerTitle');

let body = $('body'),
	title = $('#main-title'),
	content = $('#main-content');

if(teamID && formerRank){

	body.attr('id', 'formerSelect');
	title.empty().append(teamTitle + ' - ' + formerTitle);

	let change = '<button class="action action-red" data-change-former="former">Switch Former</button>';

	content.append(change);

	$('[data-change-former="former"]').on('click',function(){
		window.localStorage.removeItem('formerRank');
		location.reload(true);
	});

	socket.emit('getBecode');
	socket.on('setBecode',function(teams){

		let learners = teams[teamID].learner;

		let learnersHeader = '<ul id="learners" class="list">',
			learnersContent = '',
			learnersFooter = '</ul>';

		for( let i in learners ){
			let learner 
				= '<li class="list-item">'
				+ '<div class="item-title">'
				+ learners[i].name + ' ' + learners[i].lastname
				+ '</div>'
				+ '<div class="item-actions">'
				+ '<button class="action action-yellow" data-learner-set="'+i+'">Set</button>'
				+ '<button class="action action-blue" data-learner-isin="'+i+'">IsIn</button>'
				+ '</div>'
				+ '</li>';

			learnersContent += learner;
		}

		content.append(learnersHeader + learnersContent + learnersFooter);

		// $('#formers [data-former-rank]').on('click',function(){
		// 	let rank = $(this).attr('data-former-rank');
		// 	window.localStorage.setItem('formerRank', rank);
		// 	window.localStorage.setItem('formerTitle', team.former[rank]);
		// 	location.reload(true);
		// });
	});
	
}else if(teamID){
	body.attr('id', 'formerSelect');
	title.empty().append(teamTitle);

	let change = '<button class="action action-red" data-change-team="team">Switch Team</button>';

	content.append(change);

	$('[data-change-team="team"]').on('click',function(){
		window.localStorage.removeItem('teamID');
		location.reload(true);
	});

	socket.emit('getBecode');
	socket.on('setBecode',function(teams){
		let team = teams[teamID];

		let formers = team.former;

		let formersHeader = '<ul id="formers" class="list">',
			formersContent = '',
			formersFooter = '</ul>';

		for( let rank in formers ){
			let former 
				= '<li class="list-item">'
				+ '<div class="item-title">'
				+ formers[rank]
				+ '</div>'
				+ '<div class="item-actions">'
				+ '<button class="action action-blue" data-former-rank="'+rank+'">Select</button>'
				+ '</div>'
				+ '</li>';

			formersContent += former;
		}
		let former 
			= '<li class="list-item">'
			+ '<div class="item-title">'
			+ 'Supersede'
			+ '</div>'
			+ '<div class="item-actions">'
			+ '<button class="action action-blue" data-former-rank="supersede">Select</button>'
			+ '</div>'
			+ '</li>';

		formersContent += former;

		content.append(formersHeader + formersContent + formersFooter);

		$('#formers [data-former-rank]').on('click',function(){
			let rank = $(this).attr('data-former-rank');
			window.localStorage.setItem('formerRank', rank);
			window.localStorage.setItem('formerTitle', team.former[rank]);
			location.reload(true);
		});
	});
}else{
	body.attr('id', 'teamSelect');
	title.empty().append('Select your team');

	socket.emit('getBecode');
	socket.on('setBecode',function(teams){

		let teamsHeader = '<ul id="teams" class="list">',
			teamsContent = '',
			teamsFooter = '</ul>';

		for( let i in teams ){
			let team 
				= '<li class="list-item">'
				+ '<div class="item-title">'
				+ teams[i].name
				+ '</div>'
				+ '<div class="item-actions">'
				+ '<button class="action action-blue" data-team-id="'+i+'">Select</button>'
				+ '</div>'
				+ '</li>';
			teamsContent += team;
		}

		content.append(teamsHeader + teamsContent + teamsFooter);

		$('#teams [data-team-id]').on('click',function(){
			let id = $(this).attr('data-team-id');
			window.localStorage.setItem('teamID', id);
			window.localStorage.setItem('teamTitle', teams[id].name);
			location.reload(true);
		});
	});
}
