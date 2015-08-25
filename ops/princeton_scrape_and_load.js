var request = require('request');
var cheerio = require('cheerio');

request('https://registrar.princeton.edu/course-offerings/search_results.xml?submit=Search&term=1162&coursetitle=&instructor=&distr_area=&level=&cat_number=&sort=SYN_PS_PU_ROXEN_SOC_VW.SUBJECT%2C+SYN_PS_PU_ROXEN_SOC_VW.CATALOG_NBR%2CSYN_PS_PU_ROXEN_SOC_VW.CLASS_SECTION%2CSYN_PS_PU_ROXEN_SOC_VW.CLASS_MTG_NBR', function (err, res, html) {
    if (!err && res.statusCode == 200) {
        var princeton_courses = [];
        var $ = cheerio.load(html);

        $tr = $('tr').first().next('tr'); // first row contained labels; skip it
        getCourseInfo($, $tr);
    }
    else {
        console.log('error occurred:');
        console.log(err);
    }
});

function getCourseInfo($, $tr) {
    course_id = $($tr.children()[0]).text().replace(/\s\s+|\n/g, ' ').trim();
    course_tech_name = $($tr.children()[1]).text().replace(/\s\s+|\n/g, ' ').trim();
    course_norm_name = $($tr.children()[2]).text().replace(/\s\s+|\n/g, ' ').trim();
    course_distr_area = $($tr.children()[3]).text().replace(/\s\s+|\n/g, ' ').trim();
    course_sect = $($tr.children()[4]).text().replace(/\s\s+|\n/g, ' ').trim();
    course_days = $($tr.children()[5]).text().replace(/\s\s+|\n/g, ' ').trim();
    course_time = $($tr.children()[6]).text().replace(/\s\s+|\n/g, ' ').trim();
    courseUrl = $($tr.children()[1]).children('a').attr('href');

    request('https://registrar.princeton.edu/course-offerings/' + courseUrl, function(err, res, html) {
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(html);
            var prof = $('#timetable').children('p').first().text().replace(/\s\s+|\n/g, ' ').trim();
            var course = [course_id, course_tech_name, course_norm_name, prof, course_distr_area, course_sect, course_days, course_time];
            console.log(course);
            // load course into mongo here
            getCourseInfo($, $tr.next('tr'));
        }
        else {
            console.log('error on getting professor');
            var prof = "";
            var course = [course_id, course_tech_name, course_norm_name, prof, course_distr_area, course_sect, course_days, course_time];
            console.log(course);
            // load course into mongo here
            getCourseInfo($, $tr.next('tr'));
        }
    });
}
