package com.wimb.dataservice;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpPrincipal;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.*;
import java.text.DateFormat;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static junit.framework.Assert.assertEquals;

/**
 * Created by akozhanov on 9/4/2015.
 */
public class DataServiceTest {

    @Test
    public void myTest(){}

    @Test
    public void testPrepareInsertStatement() {

        HttpExchange httpExchange = new HttpExchange() {
            @Override
            public Headers getRequestHeaders() {
                return null;
            }

            @Override
            public Headers getResponseHeaders() {
                return null;
            }

            @Override
            public URI getRequestURI() {
                try {
                    return new URI("http://127.0.0.1:10000/data/226?time=2015-09-03T10:16:50Z&lat=50.5174202&long=30.4485796&s=0.0&dir=0.0&sat=25&alt=0.0&acc=26.23900032043457&prov=network&batt=28.0&aid=8a53003a7f32ce99&ser=LGD856cd544cf6");
                } catch (URISyntaxException e) {
                    e.printStackTrace();
                }
                return null;
            }

            @Override
            public String getRequestMethod() {
                return null;
            }

            @Override
            public HttpContext getHttpContext() {
                return null;
            }

            @Override
            public void close() {

            }

            @Override
            public InputStream getRequestBody() {
                return null;
            }

            @Override
            public OutputStream getResponseBody() {
                return null;
            }

            @Override
            public void sendResponseHeaders(int i, long l) throws IOException {

            }

            @Override
            public InetSocketAddress getRemoteAddress() {
                try {
                    return new InetSocketAddress(Inet4Address.getByAddress(new byte[]{127, 0, 0, 1}), 10000);
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                return null;
            }

            @Override
            public int getResponseCode() {
                return 0;
            }

            @Override
            public InetSocketAddress getLocalAddress() {
                return null;
            }

            @Override
            public String getProtocol() {
                return null;
            }

            @Override
            public Object getAttribute(String s) {
                return null;
            }

            @Override
            public void setAttribute(String s, Object o) {

            }

            @Override
            public void setStreams(InputStream inputStream, OutputStream outputStream) {

            }

            @Override
            public HttpPrincipal getPrincipal() {
                return null;
            }
        };

        Map<String, Object> params = DataService.queryToMap(httpExchange);
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String currDate = df.format(new Date());
        assertEquals("insert into bus_data (client_addr, server_time, local_time, lat, lon, alt, speed, accuracy, direction, datasrc, satellites, battery, descr, android_id, serialno) values ('/127.0.0.1:10000','" + currDate + "','2015-09-03 10:16:50',50.5174202,30.4485796,0.0,0.0,26.23900032043457,0.0,0,25,28.0,null,'8a53003a7f32ce99','LGD856cd544cf6')",
                DataService.mapToSqlInsert(params));
    }
}
