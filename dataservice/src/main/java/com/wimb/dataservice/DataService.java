package com.wimb.dataservice;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by akozhanov on 9/1/2015.
 */
public class DataService {

    static class DataHandler implements HttpHandler {
        public void handle(HttpExchange httpExchange) throws IOException {
            Map<String,String> params = DataService.queryToMap(httpExchange.getRequestURI().getQuery());
            DataService.writeResponse(httpExchange, null);
        }
    }

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(10000), 0);
        server.createContext("/data/226", new DataHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
    }

    public static void writeResponse(HttpExchange httpExchange, String response) throws IOException {
        httpExchange.sendResponseHeaders(200, response.length());
        OutputStream os = httpExchange.getResponseBody();
        os.write(response.getBytes());
        os.close();

    }

    public static Map<String, String> queryToMap(String query){
        Map<String, String> result = new HashMap<String, String>();
        for (String param : query.split("&")) {
            String pair[] = param.split("=");
            if (pair.length>1) {
                result.put(pair[0], pair[1]);
            }else{
                result.put(pair[0], "");
            }
            System.out.println(pair[0] + ":" + pair[1]);
        }
        return result;
    }

}
