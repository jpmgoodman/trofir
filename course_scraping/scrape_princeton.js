// creates 2d array, princeton_courses,
// with fall 2015-2016 courses and info

var request = require('request');
var cheerio = require('cheerio');

request('https://registrar.princeton.edu/course-offerings/search_results.xml?submit=Search&term=1162&coursetitle=&instructor=&distr_area=&level=&cat_number=&sort=SYN_PS_PU_ROXEN_SOC_VW.SUBJECT%2C+SYN_PS_PU_ROXEN_SOC_VW.CATALOG_NBR%2CSYN_PS_PU_ROXEN_SOC_VW.CLASS_SECTION%2CSYN_PS_PU_ROXEN_SOC_VW.CLASS_MTG_NBR', function (error, response, html) {
  if (!error && response.statusCode == 200) {
  	var princeton_courses = [];
  	var $ = cheerio.load(html);
  	$('tr').each(function(i, tr) {
  		// skip first row!
  		course_id = $(tr.children[1]).text().replace(/ /g, '').replace(/\n/g, '');
  		course_tech_name = $(tr.children[3]).text().replace(/ /g, '').replace(/\n/g, '');
  		course_norm_name = $(tr.children[5]).text().replace(/\n/g, '');
  		course_dist = $(tr.children[7]).text().replace(/ /g, '').replace(/\n/g, '');
  		course_sect = $(tr.children[9]).text().replace(/ /g, '').replace(/\n/g, '');
  		course_days = $(tr.children[11]).text().replace(/ /g, '').replace(/\n/g, '');
  		course_time = $(tr.children[13]).text().replace(/ /g, '').replace(/\n/g, '');

  		var course = [course_id, course_tech_name, course_norm_name, course_dist, course_sect, course_days, course_time];
  		princeton_courses.push(course);
  	});

  	// do whatever with princeton_courses here; fill database with info
  	// work with express models when the time comes

  }
  else {
  	console.log('error occurred:');
  	console.log(error);
  }
});