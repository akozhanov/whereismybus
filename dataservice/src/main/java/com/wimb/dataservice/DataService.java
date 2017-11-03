package com.wimb.dataservice;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.*;
import java.text.DateFormat;
import java.text.MessageFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by akozhanov on 9/1/2015.
 */
public class DataService {

    private static final Logger logger = Logger.getLogger(DataService.class.getName());
    private static Connection conn = null;
    private static int counter = 0;
    private static DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss.SSS'Z'");

    static class DataHandler implements HttpHandler {
        public void handle(HttpExchange httpExchange) throws IOException {
            Map<String, Object> params = DataService.queryToMap(httpExchange);
                try {
                    Statement stmt = conn.createStatement();
                    String sql = mapToSqlInsert(params);
                    stmt.executeUpdate(sql);
                    logger.log(Level.SEVERE, "logged {0}:{1}", new Object[]{httpExchange.getRemoteAddress(), httpExchange.getRequestURI().getQuery()});
                } catch (SQLException e) {
                    logger.log(Level.SEVERE, e.getMessage(), e);
                }
            DataService.writeResponse(httpExchange, "");
        }
    }

    public static void main(String[] args) throws Exception {
        logger.setLevel(Level.FINE);
        try {
            System.out.println("trying to connect");
            conn = DriverManager.getConnection("jdbc:mysql://wimb-db:3306/wimb?user=root&password=dat1a57");
            logger.fine("DB has been connected");
        } catch (SQLException e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        HttpServer server = HttpServer.create(new InetSocketAddress(10000), 0);
        server.createContext("/data/226", new DataHandler());
        server.setExecutor(null); // creates a default executor
        logger.info("DATA SERVICE HAS BEEN STARTED!");
        server.start();
    }

    public static void writeResponse(HttpExchange httpExchange, String response) throws IOException {
        httpExchange.sendResponseHeaders(200, response.length());
        OutputStream os = httpExchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    protected static Map<String, Object> queryToMap(HttpExchange httpExchange){
        Map<String, Object> result = new HashMap<String, Object>();
        for (String param : httpExchange.getRequestURI().getQuery().split("&")) {
            String pair[] = param.split("=");
            if (pair.length>1) {
                if (pair[0].equals("time"))
                    try {
                        result.put(pair[0], df.parse(pair[1]));
                    } catch (ParseException e) {
                        logger.log(Level.WARNING, e.getMessage(), e);
                        result.put(pair[0], null);
                    }
                else
                        result.put(pair[0], pair[1]);
            }else{
                result.put(pair[0], "");
            }
        }
        result.put("client-addr", httpExchange.getRemoteAddress().toString());
        result.put("server-time", new Date());
        return result;
    }

    protected static String mapToSqlInsert(Map<String, Object> params){
        String result = new MessageFormat("insert into bus_data (client_addr, server_time, local_time, lat, lon, alt, speed, accuracy, direction, datasrc, satellites, battery, descr, android_id, serialno) values " +
                "(''{0}'',''{1,date,yyyy-MM-dd HH:mm:ss}'',''{2,date,yyyy-MM-dd HH:mm:ss}'',{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},''{13}'',''{14}'')").format(
                new Object[]{
                        params.get("client-addr"),
                        params.get("server-time"),
                        params.get("time"),
                        params.get("lat"),
                        params.get("long"),
                        params.get("alt"),
                        params.get("s"),
                        params.get("acc"),
                        params.get("dir"),
                        params.get("prov").equals("gps")?1:0,
                        params.get("sat"),
                        params.get("batt"),
                        params.get("desc")!=null?"'" + params.get("desc") + "'":"null",
                        params.get("aid"),
                        params.get("ser")
                }
        );
        return result;
    }
}
