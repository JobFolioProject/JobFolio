package com.happyjob.jobfolio.controller.notice;

import java.io.File;
import java.io.FileInputStream;
import java.io.StringReader;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorker;
import com.itextpdf.tool.xml.XMLWorkerFontProvider;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.itextpdf.tool.xml.css.CssFile;
import com.itextpdf.tool.xml.css.StyleAttrCSSResolver;
import com.itextpdf.tool.xml.html.CssAppliers;
import com.itextpdf.tool.xml.html.CssAppliersImpl;
import com.itextpdf.tool.xml.html.Tags;
import com.itextpdf.tool.xml.parser.XMLParser;
import com.itextpdf.tool.xml.pipeline.css.CSSResolver;
import com.itextpdf.tool.xml.pipeline.css.CssResolverPipeline;
import com.itextpdf.tool.xml.pipeline.end.PdfWriterPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipelineContext;


import com.happyjob.jobfolio.service.NoticeService.NoticeService;
import com.happyjob.jobfolio.vo.notice.NoticeModel;

import com.happyjob.jobfolio.common.comnUtils.ExcelDownloadParam;
import com.happyjob.jobfolio.common.comnUtils.ExcelDownloadView;
import com.happyjob.jobfolio.common.comnUtils.ComnUtil;
import org.springframework.web.servlet.View;
import org.springframework.ui.ModelMap;

@Controller
@RequestMapping("/system/")
public class NoticeController {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();

	@Autowired
	private NoticeService noticeService;

	@Value("${fileUpload.rootPath}")
	private String rootPath;
	
	@Value("${fileUpload.noticePath}")
	private String noticePath;
	
	@Value("${fileUpload.virtualRootPath}")
	private String virtualRootPath;
	
	@Value("${fontdir}")
	private String fontdir;
	
	@Value("${pdffont}")
	private String pdffont;
	
	@Value("${pdfcss}")
	private String pdfcss;
	
	// 공지사항 리스트 출력
	@RequestMapping("noticeListvue.do")
	@ResponseBody
	public Map<String, Object> noticeListvue(Model model, @RequestParam Map<String, Object> paramMap,
			HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);
		//String title = (String) paramMap.get("title");

		int currentPage = Integer.parseInt((String) paramMap.get("currentpage")); // 현재페이지
		int pageSize = Integer.parseInt((String) paramMap.get("pagesize"));
		int pageIndex = (currentPage - 1) * pageSize;
        // (X  - 1) * 10
		
		paramMap.put("pageIndex", pageIndex);
		paramMap.put("pageSize", pageSize);
		//paramMap.put("title", title);

		// 공지사항 목록 조회
		List<NoticeModel> noticeList = noticeService.noticeList(paramMap);
		// 목록 수 추출해서 보내기
		int noticeCnt = noticeService.noticeCnt(paramMap);

		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("listdate", noticeList); // success 용어 담기
		resultMap.put("totalcnt", noticeCnt); // 리턴 값 해쉬에 담기
		resultMap.put("pageSize", pageSize);
		resultMap.put("currentPage", currentPage);

		return resultMap;
	}

	@PostMapping("/noticeDetail")
	@ResponseBody
	public Map<String, Object> noticeDetail(@RequestParam Map<String, Object> paramMap) throws Exception {
		logger.info("noticeDatail start");
		logger.info("   - paramMap : " + paramMap);
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			resultMap.put("noticeDetail", noticeService.noticeDetail(paramMap));
		} catch (Exception e) {
			throw e;
		}
		return resultMap;
	}
	
	
	@PostMapping("/noticefileDetail")
	public void noticefileDetail(@RequestParam Map<String, Object> paramMap,HttpServletResponse response) throws Exception {
		logger.info("noticefileDetail start");
		logger.info("   - paramMap : " + paramMap);
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			NoticeModel noticeinfo = noticeService.noticeDetail(paramMap);
			
			byte fileByte[] = FileUtils.readFileToByteArray(new File(noticeinfo.getPhygical_path()));
			
			response.setContentType("application/octet-stream");
		    response.setContentLength(fileByte.length);
		    response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(noticeinfo.getFile_name(),"UTF-8")+"\";");
		    response.setHeader("Content-Transfer-Encoding", "binary");
		    response.getOutputStream().write(fileByte);
		     
		    response.getOutputStream().flush();
		    response.getOutputStream().close();
			
			
			
		} catch (Exception e) {
			throw e;
		}
	}

	@PostMapping("/noticeUpdate")
	@ResponseBody
	public Map<String, Object> noticeUpdate(HttpSession session,@RequestParam Map<String, Object> paramMap, HttpServletRequest request) throws Exception {
		logger.info("noticeUpdate start");
		logger.info("   - paramMap : " + paramMap);
		
		Map<String, Object> returnmap = new HashMap<String,Object>();
		
		try {
			paramMap.put("loginId",(String) session.getAttribute("loginId"));
			
			noticeService.noticeUpdate(paramMap);
			//noticeService.noticeUpdatefile(paramMap, request);
			
			returnmap.put("result",1);
			returnmap.put("resultmsg","수정 되었습니다.");
		} catch (Exception e) {
			throw e;
		}
		
		return returnmap;
	}
	
	@PostMapping("/noticeUpdatefile")
	@ResponseBody
	public Map<String, Object> noticeUpdatefile(HttpSession session,@RequestParam Map<String, Object> paramMap, HttpServletRequest request) throws Exception {
		logger.info("noticeUpdate start");
		logger.info("   - paramMap : " + paramMap);
		
		Map<String, Object> returnmap = new HashMap<String,Object>();
		   
		try {
			paramMap.put("loginId",(String) session.getAttribute("loginId"));
			
			//noticeService.noticeUpdate(paramMap);
			noticeService.noticeUpdatefile(paramMap, request);
			
			returnmap.put("result",1);
			returnmap.put("resultmsg","수정 되었습니다.");
		} catch (Exception e) {
			throw e;
		}
		
		return returnmap;
	}

	@PostMapping("/insertNotice")
	@ResponseBody
	public Map<String, Object> insertNotice(HttpSession session,@RequestParam Map<String, Object> paramMap, HttpServletRequest request) throws Exception {
		logger.info("insertNotice start");
		logger.info("   - paramMap : " + paramMap);

		Map<String, Object> returnmap = new HashMap<String,Object>();
		try {
			paramMap.put("loginId",(String) session.getAttribute("loginId"));
			noticeService.insertNotice(paramMap);
			//noticeService.insertNoticefile(paramMap,request);
			
			returnmap.put("result",1);
			returnmap.put("resultmsg","등록 되었습니다.");
			
		} catch (Exception e) {
			throw e;
		}
		
		return returnmap;
	}
	
	@PostMapping("/insertNoticefile")
	@ResponseBody
	public Map<String, Object> insertNoticefile(HttpSession session,@RequestParam Map<String, Object> paramMap, HttpServletRequest request) throws Exception {
		logger.info("insertNotice start");
		logger.info("   - paramMap : " + paramMap);

		Map<String, Object> returnmap = new HashMap<String,Object>();
		try {
			paramMap.put("loginId",(String) session.getAttribute("loginId"));
			//noticeService.insertNotice(paramMap);
			noticeService.insertNoticefile(paramMap,request);
			
			returnmap.put("result",1);
			returnmap.put("resultmsg","등록 되었습니다.");
			
		} catch (Exception e) {
			returnmap.put("result",-1);
			returnmap.put("resultmsg","실패 되었습니다.");
			//throw e;
		}
		
		return returnmap;
	}
	
	@PostMapping("/noticeDelete")
	@ResponseBody
	public Map<String, Object> noticeDelete(@RequestParam Map<String, Object> paramMap) throws Exception {
		logger.info("noticeDelete start");
		logger.info("   - paramMap : " + paramMap);
		
		Map<String, Object> returnmap = new HashMap<String,Object>();
		
		try {
			noticeService.noticeDelete(paramMap);
			returnmap.put("result", 1);
			returnmap.put("resultmsg", "삭제 되었습니다.");
		} catch (Exception e) {
			returnmap.put("result", -1);
			returnmap.put("resultmsg", e.getMessage());
		}
		
		return returnmap;
	}
	
	@RequestMapping("/noticepdfDown.do")
	public void noticepdfDown( @RequestParam Map<String, Object> paramMap, Model model, HttpServletRequest request,
			HttpServletResponse response, HttpSession session) throws Exception {
		
		logger.info("+ Start " + className + ".noticepdfDown");
		logger.info("   - paramMap : " + paramMap);
		
		// 1. PDF
		// 2. 지정된 디렉토리에 PDF 저장
		// 3. PDF 화면 전달
		
		String SRC = rootPath + File.separator + noticePath + File.separator + "Noticepdf.pdf";  //  
		String DESC = "noticedesc.pdf";
		
		paramMap.put("pageIndex", 0);
		paramMap.put("pageSize", noticeService.noticeCnt(paramMap));
		
		List<NoticeModel> listdata = noticeService.noticeList(paramMap);
		
		String cationhtml = "검색 조건    ";
		String innerhtml = "";
		
		if(!"".equals((String)paramMap.get("stitle")) 
		   || !"".equals((String)paramMap.get("ssdate"))
		   || !"".equals((String)paramMap.get("sedate")) ) {
			
			if(!"".equals((String)paramMap.get("stitle"))) {
				cationhtml += " 제목 : ";
				cationhtml += (String)paramMap.get("stitle");
			} 
	        
			if(!"".equals((String)paramMap.get("ssdate"))) {
				cationhtml += " 시작일자 : ";
				cationhtml += (String)paramMap.get("ssdate");
			}
			
	        if(!"".equals((String)paramMap.get("sedate"))) {
				cationhtml += " 종료일자 : ";
				cationhtml += (String)paramMap.get("sedate");
			}
		} else {
			cationhtml += "없음";
		}
		
		for(NoticeModel item : listdata) {
			String itemhtml = "<tr>";
			   
			itemhtml += "<td style='align: center'>";
			itemhtml += String.valueOf(item.getNoticeNo());
			itemhtml += "</td>";	
			
			itemhtml += "<td>";
			itemhtml += item.getNoticeTitle();
			itemhtml += "</td>";	

			itemhtml += "<td>";
			itemhtml += item.getLoginName();
			itemhtml += "</td>";	
			
			itemhtml += "<td>";
			itemhtml += item.getNoticeRegdate();
			itemhtml += "</td>";
			
			itemhtml += "</tr>";  
			
			innerhtml += itemhtml;
		}
		
		
		Document document = new Document(PageSize.A4, 50, 50, 50, 50); // 용지 및 여백 설정

		try {
			PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(SRC)); //현재상대경로에 pdf 생성
			writer.setInitialLeading(12.5f);
			
			document.open(); //생성된 파일을 오픈
			XMLWorkerHelper helper = XMLWorkerHelper.getInstance();

			// 사용할 CSS 를 준비한다.
			CSSResolver cssResolver = new StyleAttrCSSResolver();
			CssFile cssFile = null;
			try {
				cssFile = helper.getCSS(new FileInputStream(rootPath+ File.separator + fontdir + File.separator + pdfcss));
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			
			// HTML 과 폰트준비
			XMLWorkerFontProvider fontProvider = new XMLWorkerFontProvider(XMLWorkerFontProvider.DONTLOOKFORFONTS);
			fontProvider.register(rootPath + File.separator + fontdir + File.separator + pdffont,"MalgunGothic"); // MalgunGothic 은 alias,
			CssAppliers cssAppliers = new CssAppliersImpl(fontProvider);

			HtmlPipelineContext htmlContext = new HtmlPipelineContext(cssAppliers);
			htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());

			// Pipelines
			PdfWriterPipeline pdf = new PdfWriterPipeline(document, writer);
			// Html의pipeline을 생성 (html 태그, pdf의 pipeline설정)
			HtmlPipeline html = new HtmlPipeline(htmlContext, pdf);
			// css의pipeline을 합친다.
			CssResolverPipeline css = new CssResolverPipeline(cssResolver, html);
			//Work 생성 pipeline 연결
			XMLWorker worker = new XMLWorker(css, true);
			//Xml 파서 생성(Html를 pdf로 변환)
			XMLParser xmlParser = new XMLParser(worker, Charset.forName("UTF-8"));

			// 폰트 설정에서 별칭으로 줬던 "MalgunGothic"을 html 안에 폰트로 지정한다.
			String htmlStr = "<html>"  
					       + "<head></head>"  
					       + "<body style=\"font-family:MalgunGothic;\">"  
			               + "<div style='align: center'>"
					       + "<h1 style='text-align: center'>공지사항 관리</h1>"
					       + "<table border=1 class='col'>"
					       + "<caption>"
					       + cationhtml
					       + "</caption>"
				           + "<thead>"   
				           + "<tr>"
				           + "<th style='width: 10%;text-align: center'>글번호</th>"
				           + "<th style='width: 30%;text-align: center'>제목</th>"
				           + "<th style='width: 15%;text-align: center'>작성자</th>"
				           + "<th style='width: 15%;text-align: center'>등록일</th>"
				           + "</tr>"
				           + "</thead>"
				           + "<tbody>"
				           + innerhtml
				           + "</tbody>"
				           + "</table>"
					       + "</div>"
			               + "</body></html>";
			

			
			//StringReader strReader = new StringReader(htmlStr);
			//xmlParser.parse(strReader);
			try (StringReader strReader = new StringReader(htmlStr)) {
				xmlParser.parse(strReader);
			}
			
			document.close();
			writer.close();
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
	        e.printStackTrace();
	    }
		
		byte fileByte[] = FileUtils.readFileToByteArray(new File(SRC));
		  
		response.setContentType("application/octet-stream");
		response.setContentLength(fileByte.length);
		response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode("Noticepdf.pdf","UTF-8")+"\";");
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.getOutputStream().write(fileByte); 
		response.getOutputStream().flush();
	    response.getOutputStream().close();
	    
	    File makefile = new File(SRC);
	    makefile.delete();
	    
		
		logger.info("+ End " + className + ".noticepdfDown");
		
		return;		

	}	
	
	@RequestMapping("/noticeexcelDown.do")
	public View responseStatExcel(ModelMap excelParams, @RequestParam Map<String, Object> paramMap) throws Exception {
		
		logger.info("+ Start " + className + ".responseStatExcel");
	    logger.info("   - paramMap : " + paramMap);
	      
		paramMap.put("pageIndex", 0);
		paramMap.put("pageSize", noticeService.noticeCnt(paramMap));
		
		List<NoticeModel> listdata = noticeService.noticeList(paramMap);
		
		makenoticeexcel(excelParams, paramMap, listdata);
			
		return new ExcelDownloadView();
	}	
	
	private void makenoticeexcel(ModelMap excelParams, Map<String, Object> paramMap, List<NoticeModel> resultList) {
		
		List<HashMap<String, Object>> results = new ArrayList<HashMap<String, Object>>();
		        
	    // n.ntc_no as noticeNo
	    // n.ntc_title as noticeTitle
	    // DATE_FORMAT(n.ntc_regdate, '%Y-%m-%d') as noticeRegdate
	    // u.loginID as loginId
	    // u.name as loginName
		
		for(NoticeModel each : resultList){
			HashMap<String, Object> result = new HashMap<String, Object>();
			if(each !=null ){				
				result.put("noticeNo",each.getNoticeNo());
				result.put("noticeTitle",each.getNoticeTitle());
				result.put("noticeRegdate",ComnUtil.NVL(each.getNoticeRegdate())); 
				result.put("loginName",ComnUtil.NVL(each.getLoginName()));
			}
			
			results.add(result);
		}
		   
		ExcelDownloadParam param = new ExcelDownloadParam()
				.setExcelParams(excelParams)
				.setList(results)
				.setFilePrefix("notice")
				.setTitle("공지사항 목록")
				.setDate((String)paramMap.get("ssdate"), (String)paramMap.get("sedate"))
				.setNames("번호","제목","작성일","작성자")
				.setCols("noticeNo","noticeTitle","noticeRegdate","loginName"); 
		
		ExcelDownloadView.template(param);
	}	
}