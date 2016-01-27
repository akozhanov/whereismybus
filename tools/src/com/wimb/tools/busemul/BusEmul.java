package com.wimb.tools.busemul;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.stream.Stream;

public class BusEmul {

    private static DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss'Z'");
    private static CloseableHttpClient httpclient = HttpClients.createDefault();

    public static void main(String[] args) {

        try (Stream<String> stream = Files.lines(Paths.get("./data-files/odessa.txt"), Charset.defaultCharset())) {
            stream.forEach(BusEmul::send);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void send(String line) {
        String url = buildUrl(line);
        HttpGet httpGet = new HttpGet(url);
        CloseableHttpResponse response = null;
        try {
            System.out.println("==================================================================================");
            System.out.println(url);
            response = httpclient.execute(httpGet);
            System.out.println(response.getStatusLine().getStatusCode());
            Thread.sleep(1000);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            if (response != null) try {
                response.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static String buildUrl(String line) {
        String[] data = line.split(";");

        String template = "http://54.173.153.91:10000/data/226?time=%s&lat=%s&long=%s&s=%s&dir=%s&sat=%s&alt=%s&acc=%s&prov=%s&batt=%s&aid=%s&ser=%s";
        String localTime = df.format(new Date());
        String latitude = data[3];
        String longtitude = data[4];
        String speed = data[5];
        String direction = data[6];
        String satellites = "21";
        String altitude = data[7];
        String accuracy = data[8];
        String provider = data[9];
        String battery = data[11];
        String android_id = data[10];
        String serial_no = data[2];
        return String.format(template, localTime, latitude, longtitude, speed, direction, satellites, altitude, accuracy, provider, battery, android_id, serial_no);
    }

}
